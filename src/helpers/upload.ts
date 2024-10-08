import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import {v4} from 'uuid'
import {FileUpload} from 'graphql-upload-ts';
import { Upload as UploadOnBucket } from '@aws-sdk/lib-storage';
import { Upload } from "../graphql/resolver/media";
import { SPACE_ACCESS_ID, SPACE_ACCESS_KEY, SPACE_BUCKET_NAME, SPACE_ENDPOINT, SPACE_REGION } from "../constants/secret";

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint:SPACE_ENDPOINT,
  region: SPACE_REGION,
  credentials: {
    accessKeyId: SPACE_ACCESS_ID as string,
    secretAccessKey: SPACE_ACCESS_KEY as string
  }
});


const handleFileUpload = async (file: Upload) => {
  
  const { createReadStream, filename, mimetype } =  file;

  const key = v4();
  const bucketParams = {
    Bucket: SPACE_BUCKET_NAME,
    Body: createReadStream(),
    Key: `${key}/${filename}`,
    // acl: 'public-read',
  
  };
  const parallelUploads3 = new UploadOnBucket({
    client: s3Client,
    // @ts-ignore
    params: {...bucketParams , ACL:'public-read' , ContentType:mimetype},
  
  
  });
  return await  parallelUploads3.done();
};

export{
    handleFileUpload
}