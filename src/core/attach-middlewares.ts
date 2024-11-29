import cors from "cors";
import express, { type Application } from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword } from "../modules/account/encryption";
import PgSession from "connect-pg-simple";
import pool from "../modules/pool";
import { errorCatcher } from "../middlewares/index";
import { configDotenv } from "dotenv";
configDotenv();


export function attachMiddlewares(app: Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors({
    origin: ['https://www.tabletop-of-many-things.com', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }));
  
  const pgSession = PgSession(session);
  app.use(session({
    store: new pgSession({
      pool,
      tableName: 'session',
    }),
    name: "session",
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    },
  }));

  app.use(passport.session());

  passport.use('local', new LocalStrategy((username: string, password: string, done: any) => {
    pool
      .query('SELECT * FROM "users" WHERE username = $1', [username])
      .then((result: any) => {
        const user = result && result.rows && result.rows[0];
        if (user && comparePassword(password, user.password)) {
          done(null, user);
        } else {
          done('Incorrect username or password', null);
        }
      })
      .catch((error: string) => {
        console.log('Error with query for user ', error);
        done(error, null);
      });
  }));

  passport.serializeUser((user: any, cb) => {
    process.nextTick(() => {
      cb(null, user);
    });
  });

  passport.deserializeUser((user: any, cb) => {
    process.nextTick(() => {
      cb(null, user);
    });
  });

  app.use(errorCatcher);
}
