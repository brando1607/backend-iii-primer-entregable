import jwt from "jsonwebtoken";
export const SECRET_TOKEN = "c0d1g0 s3cr3to para el t0k3n d3 js0nw3bt0k3n";

export function generateToken(payload) {
  const token = jwt.sign(payload, SECRET_TOKEN, {
    expiresIn: "3m",
  });
  return token;
}

export function verifyToken(token) {
  try {
    const decode = jwt.verify(token, SECRET_TOKEN);
    return decode;
  } catch (error) {
    console.error(error);
  }
}
