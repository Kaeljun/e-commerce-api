import jwt from "jsonwebtoken";
import { readData, writeData } from "../utils/databaseManager";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwtManager";

export const refreshTokenController = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies?.refresh_token;
    const decoded = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );
    const users = await readData("users");

    const foundUser = users.find((user) => user.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(decoded?.id);
    const newRefreshToken = generateRefreshToken(decoded?.id);

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
      path: "public/refresh-token",
    });
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    });
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    });
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
      path: "public/refresh-token",
    });
    await writeData(
      "users",
      { ...foundUser, refreshToken: newRefreshToken },
      foundUser.id
    );
    return res.status(200).json({
      id: foundUser?.id,
      name: foundUser?.name,
      email: foundUser?.email,
    });
  } catch (err) {
    next(err);
  }
};
