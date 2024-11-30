import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../../middlewares/index";
import pool from "../../modules/pool";


const router = express.Router();
/**
 * @base_path /api/5e/characters
*/

router.get("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT * FROM "5e_characters"
    WHERE "user_id" = $1
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

router.get("/:id", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT * FROM "5e_characters"
    WHERE "id" = $1
    ORDER BY "id";
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

router.post("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    INSERT INTO "5e_characters" ("user_id")
    VALUES ($1);
  `);
  const sqlValues = [
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

router.patch("/health", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    UPDATE "5e_characters"
    SET "maxHp" = $2, "currentHp" = $3, "tempHp" = $4
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.body.id,
    req.body.maxHp,
    req.body.currentHp,
    req.body.tempHp,
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
    DELETE FROM "5e_characters"
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


export default router;
