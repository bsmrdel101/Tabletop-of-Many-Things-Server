import express, { type Application, type Response } from "express";
import accountRouter from "../controllers/account.controller";
import alertsRouter from "../controllers/alerts.controller";


export function attachRoutes(app: Application) {
  const router = express.Router();
  router.use("/account", accountRouter);
  router.use("/alerts", alertsRouter);

  app.use("/api", router);

  app.get("/", (_: any, res: Response) => {
    return res.status(200);
  });
}
