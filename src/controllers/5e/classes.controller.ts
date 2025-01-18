import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../../middlewares/index";
import pool from "../../modules/pool";


const router = express.Router();
/**
 * @base_path /api/5e/classes
*/

router.get("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT
      "5e_classes".*,
      to_jsonb("5e_subclasses") AS "subclass"
    FROM "5e_classes"
      LEFT JOIN "5e_subclasses" ON "5e_classes"."id" = "5e_subclasses"."classId"
      LEFT JOIN "game_list" ON "game_list"."userId" = $1
      LEFT JOIN "game_history" ON "game_history"."userId" = $1
    WHERE
      "5e_classes"."userId" = $1 OR
      "5e_classes"."gameId" = "game_list"."id" OR
      "5e_classes"."gameId" = "game_history"."id";
  `);
  const sqlValues = [
    req.user.id
  ];
  pool.query(sqlText, sqlValues)
    .then((dbres) => res.send(dbres.rows))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});


export default router;
