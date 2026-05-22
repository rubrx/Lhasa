import { Readable } from 'stream';
import cloudinary from '../services/lib/cloudinary';

export function uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'));
        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

export function uploadBuffers(files: Express.Multer.File[], folder: string): Promise<string[]> {
  return Promise.all(files.map((f) => uploadBuffer(f.buffer, folder)));
}
