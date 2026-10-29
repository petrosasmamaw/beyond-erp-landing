import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AccountStatus, PrismaClient, User, UserRole } from "@prisma/client";

export const rolePermissions: Record<UserRole, string[]> = {
  OWNER: ["*"],
  ADMIN: ["View", "Edit", "Delete", "Approve", "Reports", "Export", "Users", "Settings"],
  MANAGER: ["View", "Edit", "Approve", "Reports", "Export"],
  STAFF: ["View", "Edit"],
  VIEWER: ["View", "Reports"]
};

export type PublicUser = Omit<User, "passwordHash"> & {
  effectivePermissions: string[];
};

type TokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET ?? "dev-only-change-me";

export function sanitizeUser(user: User): PublicUser {
  const customPermissions = Array.isArray(user.permissions) ? (user.permissions as string[]) : [];
  const roleDefaults = rolePermissions[user.role] ?? [];

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    companyName: user.companyName,
    companyTinNumber: user.companyTinNumber,
    companySectorId: user.companySectorId,
    role: user.role,
    permissions: user.permissions,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    effectivePermissions: Array.from(new Set([...roleDefaults, ...customPermissions]))
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: User) {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "8h") as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, jwtSecret as jwt.Secret, { expiresIn });
}

export function authenticate(prisma: PrismaClient): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header("authorization");
      const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

      if (!token) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const payload = jwt.verify(token, jwtSecret) as TokenPayload;
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user || user.status !== AccountStatus.ACTIVE) {
        res.status(401).json({ message: "Invalid or disabled account" });
        return;
      }

      req.user = sanitizeUser(user);
      next();
    } catch {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

export function requirePermission(permission: string): RequestHandler {
  return (req, res, next) => {
    const permissions = req.user?.effectivePermissions ?? [];
    if (permissions.includes("*") || permissions.includes(permission)) {
      next();
      return;
    }

    res.status(403).json({ message: `Missing permission: ${permission}` });
  };
}
