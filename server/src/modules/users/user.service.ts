import prisma from '../../services/lib/prisma';
import { ConflictError, NotFoundError } from '../../shared/errors';
import { uploadBuffer } from '../../shared/upload';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  district: true,
  profileImg: true,
  role: true,
  createdAt: true,
} as const;

export const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });

  if (!user) throw new NotFoundError('User');
  return user;
};

export const updateMe = async (
  userId: number,
  data: { name?: string; phone?: string; district?: string },
  file?: Express.Multer.File,
) => {
  const profileImg = file
    ? await uploadBuffer(file.buffer, 'lhasa/profiles')
    : undefined;

  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        ...(profileImg && { profileImg }),
      },
      select: USER_SELECT,
    });
  } catch (err: any) {
    if (err.code === 'P2002') throw new ConflictError('That phone number is already linked to another account');
    throw err;
  }
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
