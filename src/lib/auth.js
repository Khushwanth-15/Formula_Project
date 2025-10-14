import crypto from "crypto";
import { prisma } from "./db.js";

const JWT_ALG = "HS256"; // HMAC-SHA256
const DEFAULT_JWT_EXP_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 120000; // modern browsers / node can handle this
  const keylen = 64;
  const digest = "sha512";
  const derived = crypto
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString("hex");
  return `${iterations}:${salt}:${derived}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  const [iterationsStr, salt, derived] = storedHash.split(":");
  const iterations = Number(iterationsStr || 0);
  if (!iterations || !salt || !derived) return false;
  const candidate = crypto
    .pbkdf2Sync(password, salt, iterations, Buffer.from(derived, "hex").length, "sha512")
    .toString("hex");
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(derived, "hex"));
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function encode(obj) {
  return base64url(JSON.stringify(obj));
}

function sign(data, secret) {
  return base64url(crypto.createHmac("sha256", secret).update(data).digest());
}

export function signJwt(payload, options = {}) {
  const secret = process.env.AUTH_SECRET || "dev-secret-change-me";
  const header = { alg: JWT_ALG, typ: "JWT" };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (options.expiresInSeconds || DEFAULT_JWT_EXP_SECONDS);
  const body = { ...payload, iat, exp };
  const unsignedToken = `${encode(header)}.${encode(body)}`;
  const signature = sign(unsignedToken, secret);
  return `${unsignedToken}.${signature}`;
}

export function verifyJwt(token) {
  try {
    const secret = process.env.AUTH_SECRET || "dev-secret-change-me";
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return null;
    const unsigned = `${h}.${p}`;
    const expected = sign(unsigned, secret);
    if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(p, "base64").toString("utf8"));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email || "").toLowerCase() }
    });
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export async function createUser({ name, email, password }) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
      }
    });

    return { id: user.id, name: user.name, email: user.email };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function authenticateUser(email, password) {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;
    if (!verifyPassword(password, user.passwordHash)) return null;
    return { id: user.id, name: user.name, email: user.email };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

export async function issueResetToken(email) {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const token = crypto.randomBytes(24).toString("hex");
    const exp = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExp: exp
      }
    });

    return { token, exp: exp.getTime() };
  } catch (error) {
    console.error('Error issuing reset token:', error);
    return null;
  }
}

export async function resetPasswordWithToken(token, newPassword) {
  try {
    const user = await prisma.user.findFirst({
      where: { resetToken: token }
    });

    if (!user) return false;
    if (!user.resetTokenExp || Date.now() > user.resetTokenExp.getTime()) return false;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashPassword(newPassword),
        resetToken: null,
        resetTokenExp: null
      }
    });

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
}


