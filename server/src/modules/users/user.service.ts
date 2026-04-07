import prisma from '../../services/lib/prisma';

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
    }
) => {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            district: true,
            profileImg: true,
            role: true,
            updatedAt: true,
        },
    });
};

