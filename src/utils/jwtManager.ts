import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { readData } from "./databaseManager";

export function generateAccessToken(id) {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(id) {
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
}

export interface DecodedUser {
  id: string;
}

export async function verifyToken(
  token: string,
  secret: Secret
): Promise<DecodedUser | undefined> {
  const decoded = jwt.verify(token, secret) as {
    id: string;
  };

  const users = await readData("users");
  const user = users?.find((u) => u.id === decoded.id);

  return user;
}
