import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { logEvents } from "./logEvents";

export const errorMiddleware = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);

  if (res.headersSent) return next(err);

  if (err instanceof TokenExpiredError)
    return res.status(401).json({ message: "Token expired." });

  if (err instanceof JsonWebTokenError)
    return res.status(401).json({ message: "Invalid token." });

  res.status(500).json({ message: "Internal server error." });
};
