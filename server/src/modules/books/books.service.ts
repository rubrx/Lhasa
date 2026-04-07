import prisma from '../../services/lib/prisma';
import cloudinary from '../../services/lib/cloudinary';
import { Condition, Category } from '../../../generated/prisma';
import { Readable } from 'stream';

type MulterFile = Express.Multer.File;

// Helper: upload a single buffer to Cloudinary
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

export const createBook = async (
  sellerId: number,
  data: {
    name: string;
    author: string;
    price: number;
    description?: string;
    condition: Condition;
    category: Category;
  },
  files: Express.Multer.File[]
) => {
  // Step 1: Validate minimum images
  if (files.length < 3) {
    throw new Error('MINIMUM_IMAGES');
  }

  // Step 2: Upload all images to Cloudinary
  const imageUrls = await Promise.all(
files.map((file: MulterFile) => uploadToCloudinary(file.buffer, 'lhasa/books'))
  );

  // Step 3: Save book to database
  const book = await prisma.book.create({
    data: {
      ...data,
      price: Number(data.price),
      images: imageUrls,
      sellerId,
    },
  });

  return book;
};

export const getApprovedBooks = async () => {
  return prisma.book.findMany({
    where: { adminCheck: 'APPROVED' },
    select: {
      id: true,
      name: true,
      author: true,
      price: true,
      condition: true,
      category: true,
      images: true,
      status: true,
      createdAt: true,
      Seller: {
        select: {
          id: true,
          name: true,
          district: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBookById = async (id: number) => {
  const book = await prisma.book.findUnique({
    where: { id, adminCheck: 'APPROVED' },
    include: {
      Seller: {
        select: {
          id: true,
          name: true,
          phone: true,
          district: true,
        },
      },
    },
  });

  if (!book) throw new Error('BOOK_NOT_FOUND');
  return book;
};

export const getMyBooks = async (sellerId: number) => {
  return prisma.book.findMany({
    where: { sellerId },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteBook = async (sellerId: number, bookId: number) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) throw new Error('BOOK_NOT_FOUND');
  if (book.sellerId !== sellerId) throw new Error('UNAUTHORIZED');

  await prisma.book.delete({ where: { id: bookId } });
};

export const reviewBook = async (
  bookId: number,
  decision: 'APPROVED' | 'REJECTED',
  rejectionReason?: string
) => {
  if (decision === 'REJECTED' && !rejectionReason) {
    throw new Error('REJECTION_REASON_REQUIRED');
  }

  return prisma.book.update({
    where: { id: bookId },
    data: {
      adminCheck: decision,
      rejectionReason: decision === 'REJECTED' ? rejectionReason : null,
    },
  });
};
