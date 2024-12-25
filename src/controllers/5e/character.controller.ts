import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../../middlewares/index";
import pool from "../../modules/pool";


const router = express.Router();
/**
 * @base_path /api/5e/characters
*/

router.get("/", ensureAuthenticated, (req: any, res: Response) => {
  const sqlText = (`
    SELECT
      "5e_characters".*,
      "assets"."image" AS "img",
      CAST(COALESCE(SUM("5e_character_classes"."lvl"), 1) AS INTEGER) AS "lvl",
      COALESCE(
        json_agg(
          to_jsonb("5e_classes") || jsonb_build_object('lvl', "5e_character_classes"."lvl")
        ) FILTER (WHERE "5e_classes"."id" IS NOT NULL), 
        '[]'
      ) AS "classes",
      to_jsonb("5e_subclasses") AS "subclass",
      to_jsonb("5e_races") AS "race",
      to_jsonb("5e_subraces") AS "subrace",
      to_jsonb("5e_backgrounds") AS "background",
      "currentHitDice"::json,
      "5e_characters"."speeds"::json,
      "senses"::json,
      "resistances"::json,
      "vulnerabilities"::json,
      "condImmunities"::json,
      "dmgImmunities"::json,
      "5e_characters"."languages"::json,
      "currency"::json,
      "targets"::json
    FROM "5e_characters"
      LEFT JOIN "assets" ON "5e_characters"."assetId" = "assets"."id"
      LEFT JOIN "5e_character_classes" ON "5e_characters"."id" = "5e_character_classes"."characterId"
      LEFT JOIN "5e_classes" ON "5e_character_classes"."classId" = "5e_classes"."id"
      LEFT JOIN "5e_subclasses" ON "5e_classes"."id" = "5e_subclasses"."classId"
      LEFT JOIN "5e_races" ON "5e_characters"."raceId" = "5e_races"."id"
      LEFT JOIN "5e_subraces" ON "5e_races"."id" = "5e_subraces"."raceId"
      LEFT JOIN "5e_backgrounds" ON "5e_characters"."backgroundId" = "5e_backgrounds"."id"
    WHERE "5e_characters"."userId" = $1
    GROUP BY "5e_characters"."id", "5e_subclasses"."id", "5e_races"."id", "5e_subraces"."id", "5e_backgrounds"."id", "assets"."id"
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
    SELECT
      "5e_characters".*,
      "assets"."image" AS "img",
      CASE 
        WHEN "5e_characters"."maxHpOverride" > 0 THEN
          "5e_characters"."maxHpOverride"
        ELSE
          ("5e_characters"."maxHp" + "5e_characters"."maxHpMod")
      END AS "maxHp",
      CAST(COALESCE(SUM("5e_character_classes"."lvl"), 1) AS INTEGER) AS "lvl",
      COALESCE(
        json_agg(
          to_jsonb("5e_classes") || jsonb_build_object('lvl', "5e_character_classes"."lvl")
        ) FILTER (WHERE "5e_classes"."id" IS NOT NULL), 
        '[]'
      ) AS "classes",
      to_jsonb("5e_subclasses") AS "subclass",
      to_jsonb("5e_races") AS "race",
      to_jsonb("5e_subraces") AS "subrace",
      to_jsonb("5e_backgrounds") AS "background",
      "currentHitDice"::json,
      "5e_characters"."speeds"::json,
      "senses"::json,
      "resistances"::json,
      "vulnerabilities"::json,
      "condImmunities"::json,
      "dmgImmunities"::json,
      "5e_characters"."languages"::json,
      "currency"::json,
      "targets"::json
    FROM "5e_characters"
      LEFT JOIN "assets" ON "5e_characters"."assetId" = "assets"."id"
      LEFT JOIN "5e_character_classes" ON "5e_characters"."id" = "5e_character_classes"."characterId"
      LEFT JOIN "5e_classes" ON "5e_character_classes"."classId" = "5e_classes"."id"
      LEFT JOIN "5e_subclasses" ON "5e_classes"."id" = "5e_subclasses"."classId"
      LEFT JOIN "5e_races" ON "5e_characters"."raceId" = "5e_races"."id"
      LEFT JOIN "5e_subraces" ON "5e_races"."id" = "5e_subraces"."raceId"
      LEFT JOIN "5e_backgrounds" ON "5e_characters"."backgroundId" = "5e_backgrounds"."id"
    WHERE "5e_characters"."id" = $1
    GROUP BY "5e_characters"."id", "5e_subclasses"."id", "5e_races"."id", "5e_subraces"."id", "5e_backgrounds"."id", "assets"."id"
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
    INSERT INTO "5e_characters" ("userId", "ruleset")
    VALUES ($1, $2);
  `);
  const sqlValues = [
    req.user.id,
    req.body.ruleset
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
    SET "maxHp" = $2, "hp" = $3, "tempHp" = $4
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.body.id,
    req.body.maxHp,
    req.body.hp,
    req.body.tempHp
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.patch("/restore-max-hp", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    UPDATE "5e_characters"
    SET "maxHp" = "prevMaxHp"
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.body.id
  ];
  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((dberror) => {
      console.log('Oops you did a goof: ', dberror);
      res.sendStatus(500);
    }
  );
});

router.put("/", ensureAuthenticated, (req: Request, res: Response) => {
  const sqlText = (`
    UPDATE "5e_characters"
    SET "maxHpMod" = $2, "maxHpOverride" = $3, "hp" = $4, "acMod" = $5, "acOverride" = $6
    WHERE "id" = $1;
  `);
  const sqlValues = [
    req.body.id,
    req.body.maxHpMod,
    req.body.maxHpOverride,
    req.body.hp,
    req.body.acMod,
    req.body.acOverride
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
