import { Arg, Mutation, Resolver } from "type-graphql";
import {FileUpload, GraphQLUpload} from 'graphql-upload-ts';

import { Stream } from "stream";
import { fileUploadResponsce } from "../class/media.class";
import { handleFileUpload } from "../../helpers/upload";

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
@Resolver()
export class MediaResolver{
    @Mutation(() => fileUploadResponsce, { nullable: true })
    async uploadFile(@Arg('file', () => GraphQLUpload) file: Upload): Promise<fileUploadResponsce> {
      try {
                // Handle file upload logic here
        
                const response:any = await handleFileUpload(file);

                return {
                  message:'success',
                  file:response.Key ,
                  success:true
                }
      } catch (error) {
        return {
          message:'failed',
          success:false,
        }
      }

      }
    
}