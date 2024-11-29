import express, { type Application, type Response } from "express";
import userRouter from "../controllers/user.controller";
import dashboardRouter from "../controllers/dashboard.controller";
import characterRouter from "../controllers/character.controller";


export function attachRoutes(app: Application) {
  const router = express.Router();
  router.use("/user", userRouter);
  router.use("/dashboard", dashboardRouter);
  router.use("/character", characterRouter);

  app.use("/api", router);

  app.get("/", (_: any, res: Response) => {
    return res.status(200);
  });
}
