import bcrypt from "bcryptjs";

export async function createHash(password) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}

export async function verifyPassword(password, hash) {
  const isCorrect = await bcrypt.compare(password, hash);
  return isCorrect;
}
