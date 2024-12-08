import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../../middlewares/index";
import pool from "../../modules/pool";


const router = express.Router();
/**
 * @base_path /api/5e/backgrounds
*/

router.get("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT * FROM "5e_backgrounds"
    WHERE "userId" = $1;
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
