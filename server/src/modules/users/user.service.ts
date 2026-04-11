import prisma from '../../services/lib/prisma';
import cloudinary from '../../services/lib/cloudinary';
import { Readable } from 'stream';

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export const getMe = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            district: true,
            profileImg: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
};

export const updateMe = async (
    userId: number,
    data: {
        name?: string;
        phone?: string;
        district?: string;
    },
    file?: Express.Multer.File
) => {
    let profileImg: string | undefined;
    if (file) {
        profileImg = await uploadToCloudinary(file.buffer, 'lhasa/profiles');
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            ...data,
            ...(profileImg && { profileImg }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            district: true,
            profileImg: true,
            role: true,
            createdAt: true,
        },
    });
};

export const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            district: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};
