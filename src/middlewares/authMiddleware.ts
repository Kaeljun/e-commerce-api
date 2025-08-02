import { readData } from "../utils/databaseManager";
import jwt, { Secret } from "jsonwebtoken";
import { env } from "node:process";
import { verifyToken } from "../utils/jwtManager";
import { access } from "node:fs";
/**
 * Middleware to authenticate requests using JWT.
 * It checks for the presence of an access token in cookies,
 * verifies it, and ensures the user exists in the database.
 */

export async function authMiddleware(req, res, next) {
  try {
    const access_token = req.cookies?.access_token;
    if (!access_token) {
      return res.status(401).json({ message: "unauthorized." });
    }

    const decoded = await verifyToken(
      access_token,
      process.env.ACCESS_TOKEN_SECRET!
    );

    if (!decoded) {
      return res.status(401).json({ message: "unauthorized." });
    }

    const allUsers = await readData("users");

    const userExists = allUsers?.find((user) => user.id === decoded.id);

    if (!userExists) {
      return res.status(403).json({ message: "user does not exist." });
    }

    req.user = userExists;

    next();
  } catch (err) {
    next(err);
  }
}
