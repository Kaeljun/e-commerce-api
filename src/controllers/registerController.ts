import { readData, writeData } from "../utils/databaseManager";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default async function registerController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password is required.",
    });
  }

  const users = await readData("users");

  const emailExists = users?.find((user) => user.email === email);

  if (emailExists) {
    return res.status(400).json({
      message: "email already exists.",
    });
  }

  const hashPassword = await bcrypt.hash(password, 8);

  const newUser = {
    id: uuidv4(),
    email,
    password: hashPassword,
  };

  await writeData("users", newUser);

  return res.status(201).json({
    message: "user created successfully",
  });
}
