// Controllers
import registerController from "./src/controllers/registerController";
import loginController from "./src/controllers/loginController";
import { authMiddleware } from "./src/middlewares/authMiddleware";
import { errorMiddleware } from "./src/middlewares/errorMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import jsonServer from "json-server";
import { refreshTokenController } from "./src/controllers/refreshTokenController";
// import { logger } from "./middlewares/logEvents";
import { authMeController } from "./src/controllers/authController";

dotenv.config();
const server = jsonServer.create();
const router = jsonServer.router("db.json");

server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.json());
server.use(cookieParser());

// === ROTAS PÚBLICAS ===
const publicRouter = express.Router();
publicRouter.post("/register", registerController);
publicRouter.post("/login", loginController);
publicRouter.get("/refresh-token", refreshTokenController);
server.use("/public", publicRouter);

// === ROTAS PROTEGIDAS ===
const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);
protectedRouter.use("/auth", authMeController);
protectedRouter.use(router);
server.use("/api", protectedRouter);

// server.use(logger);
server.use(errorMiddleware);

// Start
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
