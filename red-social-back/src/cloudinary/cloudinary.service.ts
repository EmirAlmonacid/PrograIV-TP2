import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
    constructor() {

  throw new Error(`
  CLOUD_NAME=${process.env.CLOUDINARY_CLOUD_NAME}
  API_KEY=${process.env.CLOUDINARY_API_KEY}
  SECRET=${process.env.CLOUDINARY_API_SECRET?.substring(0,10)}
  `);

}

    async uploadImage(file: any) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader
        .upload_stream(
        {
            folder: 'red-social/perfiles',
            },
            (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
            },
        )
        .end(file.buffer);
    });
    }
}