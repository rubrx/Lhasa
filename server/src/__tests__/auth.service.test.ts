import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ── Mock config/env so the service uses test values regardless of .env file ─
// Note: vi.mock is hoisted — no variables allowed inside the factory.
vi.mock("../config/env", () => ({
  env: {
    NODE_ENV: "test",
    JWT_SECRET: "test-jwt-secret-minimum-32-characters-long",
    JWT_EXPIRES_IN: "7d",
    FRONTEND_URL: "http://localhost:3000",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: 587,
    SMTP_USER: "test@test.com",
    SMTP_PASS: "test",
    SMTP_FROM: undefined,
  },
}));

const TEST_JWT_SECRET = "test-jwt-secret-minimum-32-characters-long";

// ── Mock prisma before importing auth service ──────────────────────────────
vi.mock("../services/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// ── Mock nodemailer so no real emails are sent ─────────────────────────────
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({}),
    })),
  },
}));

import prisma from "../services/lib/prisma";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../modules/auth/auth.service";

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

describe("registerUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws ConflictError if email already taken", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1 });
    await expect(
      registerUser({ name: "A", email: "a@b.com", phone: "9876543210", password: "pass12345" })
    ).rejects.toThrow("Email already registered");
  });

  it("throws ConflictError if phone already taken", async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce(null)       // email check
      .mockResolvedValueOnce({ id: 2 }); // phone check
    await expect(
      registerUser({ name: "A", email: "new@b.com", phone: "9876543210", password: "pass12345" })
    ).rejects.toThrow("Phone number already registered");
  });

  it("creates user with hashed password and returns a JWT", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 1, name: "Alice", email: "alice@lhasa.com",
      phone: "9876543210", district: "Lohit",
      role: "USER", profileImg: null, createdAt: new Date(),
    });

    const result = await registerUser({
      name: "Alice", email: "alice@lhasa.com",
      phone: "9876543210", password: "securepass",
    });

    expect(result.user.email).toBe("alice@lhasa.com");
    expect(result.token).toBeDefined();

    const decoded = jwt.verify(result.token, TEST_JWT_SECRET) as { userId: number };
    expect(decoded.userId).toBe(1);

    const createCall = mockPrisma.user.create.mock.calls[0][0];
    expect(createCall.data.password).not.toBe("securepass");
    const isHashed = await bcrypt.compare("securepass", createCall.data.password);
    expect(isHashed).toBe(true);
  });
});

describe("loginUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws ValidationError when neither email nor phone provided", async () => {
    await expect(loginUser({ password: "abc" })).rejects.toThrow("Email or phone is required");
  });

  it("throws UnauthorizedError when user not found", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    await expect(
      loginUser({ email: "ghost@lhasa.com", password: "pass" })
    ).rejects.toThrow("Invalid email or password");
  });

  it("throws UnauthorizedError on wrong password", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 1, name: "Alice", email: "alice@lhasa.com",
      phone: "9876543210", password: hashed,
      district: "Lohit", role: "USER", profileImg: null, createdAt: new Date(),
    });
    await expect(
      loginUser({ email: "alice@lhasa.com", password: "wrongpass" })
    ).rejects.toThrow("Invalid email or password");
  });

  it("returns user without password and a valid token", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 42, name: "Alice", email: "alice@lhasa.com",
      phone: "9876543210", password: hashed,
      district: "Lohit", role: "USER", profileImg: null, createdAt: new Date(),
    });

    const result = await loginUser({ email: "alice@lhasa.com", password: "correctpass" });

    expect(result.user).not.toHaveProperty("password");
    expect(result.user.email).toBe("alice@lhasa.com");
    expect(result.token).toBeDefined();
  });

  it("throws BadRequestError for OAuth-only accounts (no password)", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 5, name: "Bob", email: "bob@gmail.com",
      phone: null, password: null, district: null,
      role: "USER", profileImg: null, createdAt: new Date(),
    });
    await expect(
      loginUser({ email: "bob@gmail.com", password: "anything" })
    ).rejects.toThrow("Google sign-in");
  });
});

describe("resetPassword", () => {
  it("throws BadRequestError when JWT purpose is not 'reset'", async () => {
    const badToken = jwt.sign(
      { userId: 1, purpose: "auth" },
      TEST_JWT_SECRET,
      { expiresIn: "5m" as any }
    );
    await expect(resetPassword(badToken, "newpass")).rejects.toThrow("Invalid reset link");
  });

  it("updates password in DB when token is valid", async () => {
    const token = jwt.sign(
      { userId: 99, purpose: "reset" },
      TEST_JWT_SECRET,
      { expiresIn: "15m" as any }
    );
    mockPrisma.user.update.mockResolvedValue({});

    await resetPassword(token, "newpassword123");

    const updateCall = mockPrisma.user.update.mock.calls[0][0];
    expect(updateCall.where.id).toBe(99);
    const isHashed = await bcrypt.compare("newpassword123", updateCall.data.password);
    expect(isHashed).toBe(true);
  });
});

describe("forgotPassword", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns silently when email not registered (no info leak)", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(forgotPassword("unknown@email.com")).resolves.toBeUndefined();
  });

  it("returns silently for OAuth-only accounts", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, name: "Bob", password: null });
    await expect(forgotPassword("bob@gmail.com")).resolves.toBeUndefined();
  });
});
