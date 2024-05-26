import sharp from 'sharp';

import { env } from '$amplify/env/gen-image-thumbs';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { S3Event, S3Handler } from 'aws-lambda';

const s3Client = new S3Client();

export const handler: S3Handler = async (event: S3Event) => {
  const objectKeysUploaded = event.Records.map(
    (record: any) => record.s3.object.key
  );

  console.log(
    `Upload handler invoked for objects [${objectKeysUploaded.join(', ')}]`
  );

  const srcBucket = env.AMPLIFY_PET_SHOP_BUCKET_NAME;
  const dstBucket = env.TARGET_BUCKET_NAME;
  const srcKey = event.Records[0].s3.object.key;
  const dstKey = `thumbnails/${srcKey}`;

  const originalImage = await s3Client.send(
    new GetObjectCommand({
      Bucket: srcBucket,
      Key: objectKeysUploaded[0],
    })
  );
  // @ts-ignore
  const resizedImage = await sharp(originalImage).resize(128).toBuffer();

  const command = new PutObjectCommand({
    Bucket: srcBucket,
    Key: `thumbnails/${objectKeysUploaded[0]}`,
    Body: resizedImage,
  });

  await s3Client.send(command);
};
