import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../middlewares/index";
import pool from "../modules/pool";


const router = express.Router();
/**
 * @base_path /api/dashboard
*/

router.get("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT * FROM "games_list"
    WHERE "userId" = $1
    ORDER BY "id";
  `);
  const sqlValues = [
    req.user.id,
  ];
  pool.query(sqlText, sqlValues)
    .then((dbres) => res.send(dbres.rows))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.get("/game/:id", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT * FROM "games_list"
    WHERE "code" = $1;
  `);
  const sqlValues = [
    req.params.id,
  ];
  pool.query(sqlText, sqlValues)
    .then((dbres) => res.send(dbres.rows[0]))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.get("/history", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT * FROM "game_history"
    WHERE "userId" = $1
    ORDER BY "id";
  `);
  const sqlValues = [
    req.user.id,
  ];
  pool.query(sqlText, sqlValues)
    .then((dbres) => res.send(dbres.rows))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.post("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    INSERT INTO "games_list" ("userId", "name", "code", "dm")
    VALUES ($1, $2, $3, $4);
  `);
  const sqlValues = [
    req.user.id,
    req.body.name,
    makeID(),
    req.user.id
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(201))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.post("/history", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    INSERT INTO "game_history" ("userId", "name", "code")
    VALUES ($1, $2, $3);
  `);
  const sqlValues = [
    req.user.id,
    req.body.name,
    req.body.code
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(201))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.put("/:id", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    UPDATE "games_list"
    SET "mapId" = $1
    WHERE "id" = $2;
  `);
  const sqlValues = [
    req.body.id,
    req.params.id
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.delete("/:id", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    DELETE FROM "games_list"
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.params.id
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});


function makeID() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export default router;
