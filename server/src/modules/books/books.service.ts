import prisma from '../../services/lib/prisma';
import { Condition, Category } from '../../../generated/prisma';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../shared/errors';
import { uploadBuffers } from '../../shared/upload';

export const createBook = async (
  sellerId: number,
  data: {
    name: string;
    author: string;
    price: number;
    description?: string;
    sellerNote?: string;
    condition: Condition;
    category: Category;
  },
  files: Express.Multer.File[],
) => {
  if (files.length < 3) {
    throw new BadRequestError('At least 3 images are required');
  }

  const imageUrls = await uploadBuffers(files, 'lhasa/books');

  return prisma.book.create({
    data: {
      ...data,
      price: Number(data.price),
      images: imageUrls,
      sellerId,
    },
  });
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

  if (!book) throw new NotFoundError('Book');

  const booksListed = await prisma.book.count({
    where: { sellerId: book.sellerId, adminCheck: 'APPROVED' },
  });

  return { ...book, booksListed };
};

export const getMyBooks = async (sellerId: number) => {
  return prisma.book.findMany({
    where: { sellerId },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteBook = async (sellerId: number, bookId: number) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } });

  if (!book) throw new NotFoundError('Book');
  if (book.sellerId !== sellerId) throw new ForbiddenError('You are not allowed to delete this book');

  await prisma.book.delete({ where: { id: bookId } });
};

export const reviewBook = async (
  bookId: number,
  decision: 'APPROVED' | 'REJECTED',
  rejectionReason?: string,
) => {
  if (decision === 'REJECTED' && !rejectionReason) {
    throw new BadRequestError('Rejection reason is required');
  }

  return prisma.book.update({
    where: { id: bookId },
    data: {
      adminCheck: decision,
      rejectionReason: decision === 'REJECTED' ? rejectionReason : null,
    },
  });
};

export const getPendingBooks = async () => {
  return prisma.book.findMany({
    where: { adminCheck: 'PENDING' },
    include: {
      Seller: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getStats = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [total, thisWeek] = await Promise.all([
    prisma.book.count({ where: { adminCheck: 'APPROVED' } }),
    prisma.book.count({ where: { adminCheck: 'APPROVED', createdAt: { gte: sevenDaysAgo } } }),
  ]);
  return { total, thisWeek };
};
