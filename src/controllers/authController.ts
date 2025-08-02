import { readData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export const authMeController = async (req, res, next) => {
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
    return res.status(200).json({
      id: userExists?.id,
      email: userExists?.email,
    });
  } catch (err) {
    return next(err);
  }
};
