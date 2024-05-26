import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

type CustomS3Props = {
  bucket: string;
  prefix?: string;
};

export class CustomS3 extends Construct {
  public readonly bucket?: s3.Bucket;

  constructor(scope: Construct, id: string, props: CustomS3Props) {
    super(scope, id);

    const { bucket, prefix } = props;
    // this.bucket = new s3.Bucket(this, 'ownerPictures', {
    //   bucketName: prefix ? prefix + '/' + bucket : bucket,
    // });
  }
}
