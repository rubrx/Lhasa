import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../services/lib/prisma';

const SALT_ROUNDS = 10;

export const registerUser = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    district?: string;
}) => {
    const existingEmail = await prisma.user.findUnique({
        where: { email: data.email }
    });

    // step 1: check if email already exists
    if (existingEmail) {
        throw new Error('EMAIL_EXISTS');
    }

    const existingPhone = await prisma.user.findUnique({
        where: { phone: data.phone }
    });

    // step 2: check is phone already exists
    if (existingPhone) {
        throw new Error('PHONE_EXISTS');
    }

    // step 3: hash the password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // step 4: save the data
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            district: data.district ?? 'Lohit'
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            district: true,
            role: true,
            createdAt: true
        }
    });
    // step 5: generate the token
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    return { user, token };
}

export const loginUser = async (data: {
    email?: string;
    phone?: string;
    password: string;
}) => {
    if (!data.email && !data.phone) {
        throw new Error("EMAIL_OR_PHONE_REQUIRED");
    }
    // step 1: find user by email or phone
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                ...(data.email ? [{ email: data.email }] : []),
                ...(data.phone ? [{ phone: data.phone }] : []),
            ],
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            password: true,
            district: true,
            role: true,
            profileImg: true,
            createdAt: true,
        }
    });

    // step 2: if no user found, throw vague error
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // step 3: compare passwords
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET_NOT_DEFINED");
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    // step 5: return user without password
    const { password, ...safeUser } = user;

    return { user: safeUser, token };

}