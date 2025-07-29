import { readData, writeData } from "../utils/databaseManager";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtManager";

export default async function loginController(req: any, res: any) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password is required.",
    });
  }

  const users = await readData("users");

  const userExists = users.find((user) => user.email === email);

  if (!userExists) {
    return res.status(403).json({
      message: "invalid email or password.",
    });
  }

  const isValidPassword = await bcrypt.compare(password, userExists.password);

  if (!isValidPassword) {
    return res.status(403).json({
      message: "invalid email or password.",
    });
  }

  const refreshToken = generateRefreshToken(userExists.id);
  const accessToken = generateAccessToken(userExists.id);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
    path: "public/refresh-token",
  });

  await writeData("users", { ...userExists, refreshToken }, userExists.id);

  return res.status(200).json({
    user: {
      id: userExists.id,
      email: userExists.email,
      name: userExists.name,
    },
  });
}
