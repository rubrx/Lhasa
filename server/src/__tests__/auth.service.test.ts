import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

process.env.JWT_SECRET = "test-jwt-secret";

describe("registerUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws EMAIL_EXISTS if email already taken", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1 });
    await expect(
      registerUser({ name: "A", email: "a@b.com", phone: "1234567890", password: "pass123" })
    ).rejects.toThrow("EMAIL_EXISTS");
  });

  it("throws PHONE_EXISTS if phone already taken", async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce(null) // email check
      .mockResolvedValueOnce({ id: 2 }); // phone check
    await expect(
      registerUser({ name: "A", email: "new@b.com", phone: "1234567890", password: "pass123" })
    ).rejects.toThrow("PHONE_EXISTS");
  });

  it("creates user with hashed password and returns a JWT", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@lhasa.com",
      phone: "9876543210",
      district: "Lohit",
      role: "USER",
      profileImg: null,
      createdAt: new Date(),
    });

    const result = await registerUser({
      name: "Alice",
      email: "alice@lhasa.com",
      phone: "9876543210",
      password: "securepass",
    });

    expect(result.user.email).toBe("alice@lhasa.com");
    expect(result.token).toBeDefined();

    const decoded = jwt.verify(result.token, "test-jwt-secret") as { userId: number };
    expect(decoded.userId).toBe(1);

    // Password must be hashed — never stored in plain text
    const createCall = mockPrisma.user.create.mock.calls[0][0];
    expect(createCall.data.password).not.toBe("securepass");
    const isHashed = await bcrypt.compare("securepass", createCall.data.password);
    expect(isHashed).toBe(true);
  });
});

describe("loginUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws EMAIL_OR_PHONE_REQUIRED when neither is provided", async () => {
    await expect(loginUser({ password: "abc" })).rejects.toThrow(
      "EMAIL_OR_PHONE_REQUIRED"
    );
  });

  it("throws INVALID_CREDENTIALS when user not found", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    await expect(
      loginUser({ email: "ghost@lhasa.com", password: "pass" })
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it("throws INVALID_CREDENTIALS on wrong password", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@lhasa.com",
      phone: "9876543210",
      password: hashed,
      district: "Lohit",
      role: "USER",
      profileImg: null,
      createdAt: new Date(),
    });

    await expect(
      loginUser({ email: "alice@lhasa.com", password: "wrongpass" })
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it("returns user (without password) and token on valid credentials", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 42,
      name: "Alice",
      email: "alice@lhasa.com",
      phone: "9876543210",
      password: hashed,
      district: "Lohit",
      role: "USER",
      profileImg: null,
      createdAt: new Date(),
    });

    const result = await loginUser({ email: "alice@lhasa.com", password: "correctpass" });

    expect(result.user).not.toHaveProperty("password");
    expect(result.user.email).toBe("alice@lhasa.com");
    expect(result.token).toBeDefined();
  });

  it("throws USE_GOOGLE_LOGIN for OAuth-only accounts (no password)", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 5,
      name: "Bob",
      email: "bob@gmail.com",
      phone: null,
      password: null,
      district: null,
      role: "USER",
      profileImg: "https://lh3.googleusercontent.com/photo.jpg",
      createdAt: new Date(),
    });

    await expect(
      loginUser({ email: "bob@gmail.com", password: "anything" })
    ).rejects.toThrow("USE_GOOGLE_LOGIN");
  });
});

describe("resetPassword", () => {
  it("throws INVALID_TOKEN when JWT purpose is not 'reset'", async () => {
    const badToken = jwt.sign({ userId: 1, purpose: "auth" }, "test-jwt-secret", { expiresIn: "5m" });
    await expect(resetPassword(badToken, "newpass")).rejects.toThrow("INVALID_TOKEN");
  });

  it("updates password in DB when token is valid", async () => {
    const token = jwt.sign({ userId: 99, purpose: "reset" }, "test-jwt-secret", { expiresIn: "15m" });
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

  it("returns silently when email is not registered (no info leak)", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(forgotPassword("unknown@email.com")).resolves.toBeUndefined();
  });

  it("returns silently for OAuth-only accounts (no password set)", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, name: "Bob", password: null });
    await expect(forgotPassword("bob@gmail.com")).resolves.toBeUndefined();
  });
});
