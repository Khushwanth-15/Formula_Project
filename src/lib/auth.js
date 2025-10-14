import fs from "fs";
import path from "path";
import crypto from "crypto";

const USERS_FILE_PATH = path.join(process.cwd(), "src", "data", "users.json");
const JWT_ALG = "HS256"; // HMAC-SHA256
const DEFAULT_JWT_EXP_SECONDS = 60 * 60 * 24 * 7; // 7 days

function ensureUsersFile() {
  const dir = path.dirname(USERS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE_PATH)) {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([] , null, 2));
  }
}

export function readUsers() {
  ensureUsersFile();
  const content = fs.readFileSync(USERS_FILE_PATH, "utf8");
  try {
    const parsed = JSON.parse(content || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeUsers(users) {
  ensureUsersFile();
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
}

export function generateId() {
  return crypto.randomUUID();
}

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

export function findUserByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email.toLowerCase() === String(email || "").toLowerCase());
}

export function createUser({ name, email, password }) {
  const users = readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User already exists");
  }
  const user = {
    id: generateId(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    resetToken: null,
    resetTokenExp: null,
  };
  users.push(user);
  writeUsers(users);
  return { id: user.id, name: user.name, email: user.email };
}

export function authenticateUser(email, password) {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export function issueResetToken(email) {
  const users = readUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === String(email || "").toLowerCase());
  if (idx === -1) return null;
  const token = crypto.randomBytes(24).toString("hex");
  const exp = Date.now() + 1000 * 60 * 15; // 15 minutes
  users[idx].resetToken = token;
  users[idx].resetTokenExp = exp;
  writeUsers(users);
  return { token, exp };
}

export function resetPasswordWithToken(token, newPassword) {
  const users = readUsers();
  const idx = users.findIndex(u => u.resetToken === token);
  if (idx === -1) return false;
  const user = users[idx];
  if (!user.resetTokenExp || Date.now() > user.resetTokenExp) return false;
  users[idx].passwordHash = hashPassword(newPassword);
  users[idx].resetToken = null;
  users[idx].resetTokenExp = null;
  writeUsers(users);
  return true;
}


