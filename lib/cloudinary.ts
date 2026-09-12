import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("=== CLOUDINARY CONFIG ===");
console.log("CLOUD NAME:", cloudName);
console.log("API KEY EXISTS:", !!apiKey);
console.log("API SECRET EXISTS:", !!apiSecret);
console.log("=========================");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profiles',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY UPLOAD ERROR:", error);
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

    Readable.from(buffer).pipe(uploadStream);
  });
}