import { verifyToken } from "../utils/jwtManager";

export const authMeController = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      return res.status(401).json({ message: "unauthorized." });
    }

    const user = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
    return res.status(200).json({
      id: user?.id,
      name: user?.name,
      email: user?.email,
    });
  } catch (err) {
    return next(err);
  }
};
