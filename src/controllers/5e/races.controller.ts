import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../../middlewares/index";
import pool from "../../modules/pool";


const router = express.Router();
/**
 * @base_path /api/5e/races
*/

router.get("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT
      "5e_races".*,
      to_jsonb("5e_subraces") AS "subrace"
    FROM "5e_races"
      LEFT JOIN "5e_subraces" ON "5e_races"."id" = "5e_subraces"."raceId"
      LEFT JOIN "game_list" ON "game_list"."userId" = $1
      LEFT JOIN "game_history" ON "game_history"."userId" = $1
    WHERE
      "5e_races"."userId" = $1 OR
      "5e_races"."gameId" = "game_list"."id" OR
      "5e_races"."gameId" = "game_history"."id";
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
