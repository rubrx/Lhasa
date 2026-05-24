import prisma from '../../services/lib/prisma';
import { Prisma, Condition, Category } from '../../../generated/prisma';
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
  if (files.length < 2) {
    throw new BadRequestError('At least 2 images are required');
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

const BOOK_SELECT = {
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
} as const;

export const getApprovedBooks = async (params: {
  search?: string;
  category?: Category;
  condition?: Condition;
  maxPrice?: number;
  page?: number;
  limit?: number;
} = {}) => {
  const { search, category, condition, maxPrice, page = 1, limit = 20 } = params;

  const where: Prisma.BookWhereInput = { adminCheck: 'APPROVED' };
  if (category) where.category = category;
  if (condition) where.condition = condition;
  if (maxPrice) where.price = { lte: maxPrice };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      select: BOOK_SELECT,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.book.count({ where }),
  ]);

  return { books, total };
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
