import express, { type NextFunction, type Request, type Response } from "express";
import passport from "passport";
import { accountInfo } from "../modules/account/account.service";
import { ensureAuthenticated } from "../middlewares/index";
import { encryptPassword } from "../modules/account/encryption";
import pool from "../modules/pool";


const router = express.Router();
/**
 * @base_path /api/user
*/

router.get("/", ensureAuthenticated, accountInfo);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: string, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!user) {
      return res.status(400).json({ message: "Not authenticated" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Logged In", user: user });
    });
  })(req, res, next);
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username;
  const password = encryptPassword(req.body.password);
  const queryText = (`
    INSERT INTO "users" (username, password)
    VALUES ($1, $2) RETURNING id
  `);
  const sqlValues = [
    username,
    password,
  ];
  pool.query(queryText, sqlValues)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    }
  );
});

router.post('/logout', (req: any, res: Response) => {
  req.logout();
  res.sendStatus(200);
});


export default router;
