import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    // 1. Create the upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profiles',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error("Échec de l'upload Cloudinary."));
          return;
        }
        resolve(result.secure_url);
      },
    );

    // 2. Convert buffer to a readable stream and pipe it
    Readable.from(buffer).pipe(uploadStream);
  });
}
