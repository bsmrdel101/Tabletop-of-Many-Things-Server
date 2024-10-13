import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../middlewares/index";
import pool from "../modules/pool";


const router = express.Router();
/**
 * @base_path /api/alerts
*/

router.get("/", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    SELECT * FROM "alerts";
  `);
  pool.query(sqlText)
    .then((dbres) => res.send(dbres.rows))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.post("/", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    INSERT INTO "alerts" ("date", "addedBy", "partNum", "type", "note")
    VALUES ($1, $2, $3, $4, $5);
  `);
  const sqlValues = [
    req.body.date,
    req.body.addedBy,
    req.body.partNum,
    req.body.type,
    req.body.note
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(201))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.put("/", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    UPDATE "alerts"
    SET "date" = $2, "addedBy" = $3, "partNum" = $4, "type" = $5, "note" = $6
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.body.id,
    req.body.date,
    req.body.addedBy,
    req.body.partNum,
    req.body.type,
    req.body.note
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(201))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.delete("/:id", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    DELETE FROM "alerts"
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.params.id
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(201))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});


export default router;
