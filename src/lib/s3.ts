import { S3Client } from '@aws-sdk/client-s3';

export const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.REGION!,
});

export default s3;
