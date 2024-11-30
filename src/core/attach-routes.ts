import express, { type Application, type Response } from "express";
import userRouter from "../controllers/user.controller";
import dashboardRouter from "../controllers/dashboard.controller";
import character5eRouter from "../controllers/5e/character.controller";


export function attachRoutes(app: Application) {
  const router = express.Router();
  router.use("/user", userRouter);
  router.use("/dashboard", dashboardRouter);
  router.use("/5e/characters", character5eRouter);

  app.use("/api", router);

  app.get("/", (_: any, res: Response) => {
    return res.status(200);
  });
}
