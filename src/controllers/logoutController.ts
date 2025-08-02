import { readData, writeData } from "../utils/databaseManager";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtManager";

export default async function logoutController(req: any, res: any) {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  const users = await readData("users");

  const userExists = users?.find((user) => user.id === id);

  if (!userExists) {
    return res.status(403).json({
      message: "forbidden",
    });
  }

  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
    path: "public/refresh-token",
  });

  await writeData("users", { ...userExists, refreshToken: "" }, userExists.id);

  return res.status(200).json({
    message: "successfully logged out",
  });
}
