import sharp from 'sharp';
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

  const srcBucket = process.env.AMPLIFY_PET_SHOP_BUCKET_NAME;
  const srcKey = event.Records[0].s3.object.key;
  console.log('BUCKET', srcBucket);
  if (srcKey.startsWith('pets/')) {
    const dstKey = `thumbnails/${srcKey.split('pets/')[1]}`;

    const originalImage = await s3Client.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: dstKey,
      })
    );
    // @ts-ignore
    const resizedImage = await sharp(originalImage).resize(128).toBuffer();

    const command = new PutObjectCommand({
      Bucket: srcBucket,
      Key: `thumbnails/${objectKeysUploaded[0]}`,
      Body: resizedImage,
    });

    await s3Client
      .send(command)
      .then((value) => {
        console.log(`Thumbnail uploaded for objects ${srcKey}]`, value);
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
};
