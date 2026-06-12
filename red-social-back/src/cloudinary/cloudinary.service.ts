import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
    constructor() {

  console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API_KEY:', process.env.CLOUDINARY_API_KEY);
  console.log(
    'API_SECRET:',
    process.env.CLOUDINARY_API_SECRET?.substring(0, 5)
  );

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

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