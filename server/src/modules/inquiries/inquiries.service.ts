import prisma from '../../services/lib/prisma';

export const createInquiry = async (
    buyerId: number,
    bookId: number,
    message: string
) => {
    const book = await prisma.book.findUnique({
        where: { id: bookId, adminCheck: 'APPROVED' },
    });

    if (!book) throw new Error('BOOK_NOT_FOUND');

    return prisma.inquiry.create({
        data: { buyerId, bookId, message },
    });
};

export const getBookInquiries = async (bookId: number, userId: number) => {
    const book = await prisma.book.findUnique({
        where: { id: bookId },
    });

    if (!book) throw new Error('BOOK_NOT_FOUND');
    if (book.sellerId !== userId) throw new Error('UNAUTHORIZED');

    return prisma.inquiry.findMany({
        where: { bookId },
        include: {
            buyer: {                          // ← lowercase, matches schema
                select: { id: true, name: true, phone: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};