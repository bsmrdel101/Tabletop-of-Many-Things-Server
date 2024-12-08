import express, { type Application, type Response } from "express";
import userRouter from "../controllers/user.controller";
import dashboardRouter from "../controllers/dashboard.controller";
import character5eRouter from "../controllers/5e/character.controller";
import races5eRouter from "../controllers/5e/races.controller";
import backgrounds5eRouter from "../controllers/5e/backgrounds.controller";
import classes5eRouter from "../controllers/5e/classes.controller";


export function attachRoutes(app: Application) {
  const router = express.Router();
  router.use("/user", userRouter);
  router.use("/dashboard", dashboardRouter);
  router.use("/5e/characters", character5eRouter);
  router.use("/5e/races", races5eRouter);
  router.use("/5e/backgrounds", backgrounds5eRouter);
  router.use("/5e/classes", classes5eRouter);

  app.use("/api", router);

  app.get("/", (_: any, res: Response) => {
    return res.status(200);
  });
}
