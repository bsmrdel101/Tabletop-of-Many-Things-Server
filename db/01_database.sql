CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "newUser" BOOLEAN DEFAULT true
);

CREATE TABLE "game_list" (
    "id" SERIAL PRIMARY KEY,
    "dm" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "password" TEXT,
    "ruleset" TEXT NOT NULL
);

CREATE TABLE "games" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "mapId" INTEGER REFERENCES "5e_maps" ON DELETE CASCADE
);

CREATE TABLE "game_history" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE
);

CREATE TABLE "5e_maps" (
    "id" SERIAL PRIMARY KEY,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "sharedTo" TEXT DEFAULT '[]',
    "filepath" TEXT NOT NULL DEFAULT 'maps',
    "name" TEXT,
    "image" TEXT,
    "cellSize" INTEGER DEFAULT 50,
    "gridColor" TEXT DEFAULT '#000000',
    "gridOpacity" INTEGER DEFAULT 100,
    "offsetX" DECIMAL DEFAULT 0,
    "offsetY" DECIMAL DEFAULT 0,
    "boardState" TEXT DEFAULT '[]',
    "los" TEXT DEFAULT '[]',
    "lighting" TEXT DEFAULT '[]',
    "drawings" TEXT DEFAULT '[]'
);

CREATE TABLE "assets" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "filepath" TEXT NOT NULL DEFAULT 'assets',
    "img" TEXT
);

CREATE TABLE "5e_map_tokens" (
    "id" SERIAL PRIMARY KEY,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "mapId" INTEGER REFERENCES "5e_maps" ON DELETE CASCADE,
    "assetId" INTEGER REFERENCES "assets" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "x" INTEGER DEFAULT 0,
    "y" INTEGER DEFAULT 0,
    "size" INTEGER
);

CREATE TABLE "5e_spells" (
    "id" SERIAL PRIMARY KEY,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
    "lvl" INTEGER,
    "range" TEXT,
    "components" TEXT,
    "ritual" BOOLEAN,
    "duration" TEXT,
    "concentration" BOOLEAN,
    "castingTime" TEXT,
    "higherLvl" TEXT,
    "aoe" TEXT,
    "damage" TEXT,
    "dc" TEXT,
    "healAtSlotLvl" TEXT,
    "school" TEXT,
    "classes" TEXT,
    "subclasses" TEXT,
    "materials" TEXT
);

CREATE TABLE "5e_classes" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "name" TEXT,
    "hitDice" TEXT,
    "proficiencies" TEXT,
    "skillChoices" TEXT DEFAULT '[]',
    "saves" TEXT DEFAULT '[]',
    "startingItems" TEXT DEFAULT '[]',
    "startingItemChoices" TEXT DEFAULT '[]',
    "levels" TEXT DEFAULT '[]',
    "multiClassing" TEXT
);

CREATE TABLE "5e_subclasses" (
    "id" SERIAL PRIMARY KEY,
    "classId" INTEGER REFERENCES "5e_classes" ON DELETE CASCADE,
    "name" TEXT,
    "subclassFlavor" TEXT,
    "desc" TEXT,
    "levels" TEXT DEFAULT '[]',
    "spells" TEXT DEFAULT '[]'
);

CREATE TABLE "5e_races" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
    "abilityBonuses" TEXT NOT NULL DEFAULT '[]',
    "age" TEXT,
    "size" TEXT,
    "sizeDesc" TEXT,
    "alignment" TEXT,
    "startingProficiencies" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "languageDesc" TEXT,
    "speeds" TEXT NOT NULL DEFAULT '[]',
    "traits" TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE "5e_subraces" (
    "id" SERIAL PRIMARY KEY,
    "raceId" INTEGER REFERENCES "5e_races" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
    "abilityBonuses" TEXT NOT NULL DEFAULT '[]',
    "startingProficiencies" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "languageDesc" TEXT,
    "traits" TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE "5e_backgrounds" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
    "proficiencies" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "equipment" TEXT NOT NULL DEFAULT '[]',
    "features" TEXT NOT NULL DEFAULT '[]',
    "personalityTraits" TEXT NOT NULL DEFAULT '[]',
    "ideals" TEXT NOT NULL DEFAULT '[]',
    "bonds" TEXT NOT NULL DEFAULT '[]',
    "flaws" TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE "5e_characters" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "assetId" INTEGER REFERENCES "assets" ON DELETE CASCADE,
    "raceId" INTEGER REFERENCES "5e_races" ON DELETE CASCADE,
    "subraceId" INTEGER REFERENCES "5e_subraces" ON DELETE CASCADE,
    "backgroundId" INTEGER REFERENCES "5e_backgrounds" ON DELETE CASCADE,
    "name" TEXT NOT NULL DEFAULT 'Unnamed Character',
    "alignment" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "acOverride" INTEGER NOT NULL DEFAULT 0,
    "acMod" INTEGER NOT NULL DEFAULT 0,
    "maxHpOverride" INTEGER NOT NULL DEFAULT 0,
    "maxHpMod" INTEGER NOT NULL DEFAULT 0,
    "maxHp" INTEGER NOT NULL DEFAULT 10,
    "prevMaxHp" INTEGER NOT NULL DEFAULT 10,
    "hp" INTEGER NOT NULL DEFAULT 10,
    "tempHp" INTEGER NOT NULL DEFAULT 0,
    "insp" BOOLEAN NOT NULL DEFAULT FALSE,
    "currentHitDice" TEXT NOT NULL DEFAULT '[]',
    "speeds" TEXT NOT NULL DEFAULT '[]',
    "senses" TEXT NOT NULL DEFAULT '[]',
    "resistances" TEXT NOT NULL DEFAULT '[]',
    "vulnerabilities" TEXT NOT NULL DEFAULT '[]',
    "condImmunities" TEXT NOT NULL DEFAULT '[]',
    "dmgImmunities" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "currency" TEXT NOT NULL DEFAULT '[]',
    "spellcasting" TEXT,
    "ruleset" TEXT,
    "targets" TEXT NOT NULL DEFAULT '[]'
);

-- CREATE TABLE "5e_effects" (
--     "id" SERIAL PRIMARY KEY,
--     "name" TEXT
-- );

CREATE TABLE "5e_conditions" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT
);

CREATE TABLE "5e_character_classes" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "classId" INTEGER REFERENCES "5e_classes" ON DELETE CASCADE,
    "subclassId" INTEGER REFERENCES "5e_subclasses" ON DELETE CASCADE,
    "lvl" INTEGER DEFAULT 1
);

CREATE TABLE "5e_creatures" (
    "id" SERIAL PRIMARY KEY,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "assetId" INTEGER REFERENCES "assets" ON DELETE CASCADE,
    "filepath" TEXT NOT NULL DEFAULT 'creatures',
    "name" TEXT,
    "size" TEXT,
    "type" TEXT,
    "alignment" TEXT,
    "cr" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "ac" INTEGER NOT NULL DEFAULT 10,
    "maxHp" INTEGER NOT NULL DEFAULT 0,
    "hp" INTEGER NOT NULL DEFAULT 0,
    "tempHp" INTEGER NOT NULL DEFAULT 0,
    "insp" BOOLEAN NOT NULL DEFAULT FALSE,
    "currentHitDice" TEXT NOT NULL DEFAULT '[]',
    "speeds" TEXT NOT NULL DEFAULT '[]',
    "senses" TEXT NOT NULL DEFAULT '[]',
    "resistances" TEXT NOT NULL DEFAULT '[]',
    "vulnerabilities" TEXT NOT NULL DEFAULT '[]',
    "condImmunities" TEXT NOT NULL DEFAULT '[]',
    "dmgImmunities" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "currency" TEXT NOT NULL DEFAULT '[]',
    "spellcasting" TEXT
);

CREATE TABLE "5e_creature_abilities" (
    "id" SERIAL PRIMARY KEY,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
);

CREATE TABLE "5e_creature_actions" (
    "id" SERIAL PRIMARY KEY,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
);

CREATE TABLE "5e_creature_leg_actions" (
    "id" SERIAL PRIMARY KEY,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
);

CREATE TABLE "5e_creature_lair_actions" (
    "id" SERIAL PRIMARY KEY,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
);

CREATE TABLE "5e_creature_reactions" (
    "id" SERIAL PRIMARY KEY,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "desc" TEXT,
);

CREATE TABLE "5e_items" (
    "id" SERIAL PRIMARY KEY,
    "gameId" INTEGER REFERENCES "game_list" ON DELETE CASCADE,
    "name" TEXT NOT NULL DEFAULT 'New Item',
    "filepath" TEXT NOT NULL DEFAULT 'items',
    "desc" TEXT,
    "type" TEXT,
    "cost" TEXT,
    "lbs" INTEGER NOT NULL DEFAULT 0,
    "rarity" TEXT,
    "armorType" TEXT,
    "weaponType" TEXT,
    "dmg" TEXT,
    "range" TEXT,
    "properties" TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE "5e_inventory" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT NOT NULL DEFAULT 'New Item',
    "filepath" TEXT NOT NULL DEFAULT 'items',
    "desc" TEXT,
    "type" TEXT,
    "cost" TEXT,
    "lbs" INTEGER NOT NULL DEFAULT 0,
    "rarity" TEXT,
    "armorType" TEXT,
    "weaponType" TEXT,
    "dmg" TEXT,
    "range" TEXT,
    "properties" TEXT NOT NULL DEFAULT '[]',
    "qty" INTEGER NOT NULL DEFAULT 0,
    "attuned" BOOLEAN NOT NULL DEFAULT FALSE,
    "equipped" BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE TABLE "5e_creature_effects" (
--     "id" SERIAL PRIMARY KEY,
--     "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
--     "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
--     "effectId" INTEGER REFERENCES "5e_effects" ON DELETE CASCADE
-- );

CREATE TABLE "5e_creature_spells" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "spellId" INTEGER REFERENCES "5e_spells" ON DELETE CASCADE
);

CREATE TABLE "5e_skills" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prof" BOOLEAN DEFAULT FALSE NOT NULL,
    "mod" INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE "5e_creature_conditions" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "conditionId" INTEGER REFERENCES "5e_conditions" ON DELETE CASCADE
);

CREATE TABLE "5e_ability_scores" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "baseValue" INTEGER NOT NULL DEFAULT 10,
    "scoreOverride" INTEGER NOT NULL DEFAULT 0,
    "scoreMod" INTEGER NOT NULL DEFAULT 0,
    "prof" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "5e_variables" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE,
    "name" TEXT,
    "value" TEXT,
    "type" TEXT
);

CREATE TABLE "5e_companions" (
    "id" SERIAL PRIMARY KEY,
    "characterId" INTEGER REFERENCES "5e_characters" ON DELETE CASCADE,
    "creatureId" INTEGER REFERENCES "5e_creatures" ON DELETE CASCADE
);


-------------------------
-- INSERT DEFAULT DATA --
-------------------------

INSERT INTO "users" ("username", "password")
VALUES
    ('dev', '$2a$10$3rvmJEyHfGUQhLpuhKBmneeK76Zvw2d7wO0KYob8YKAF.DirAKcga'),
    ('test', '$2a$10$3rvmJEyHfGUQhLpuhKBmneeK76Zvw2d7wO0KYob8YKAF.DirAKcga')
;

INSERT INTO "game_list" ("userId", "name", "code", "dm", "ruleset")
VALUES
    (1, 'Dev Campaign', 'pA6ZO0', 1, '5e')
;

INSERT INTO "assets" ("userId", "gameId", "image")
VALUES 
    (1, 1, 'https://i.pinimg.com/236x/88/4a/05/884a056ba7a5a004becacbfd1bfd78fe.jpg'),
    (1, 1, 'https://i.imgur.com/zURSSgl.png'),
    (1, 1, 'https://i.imgur.com/5cibmUw.png'),
    (1, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlW_xekRD291YBhLdPKYifDnF2HV74Csz0KQ&usqp=CAU')
;

-- INSERT INTO "5e_characters" ("userId", "name", "class", "race", "background", "alignment", "level", "ac", "max_health", "current_health", "temp_health", "prof_bonus", "initiative", "inspiration", "hit_dice", "str", "dex", "con", "int", "wis", "char", "image", "walk_speed", "swim_speed", "burrow_speed", "fly_speed", "climb_speed")
-- VALUES
--     (1, 'Steve', 'Breadbarian', 'Goliath', 'Noble', 'CE', 1, 12, 20, 20, 0, 2, 2, FALSE, 12, 4, 10, 11, 20, 18, 12, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBCAMLHmC6fIfZJYcqEsOAcRue_MI924YtdHo1sCosPh5-BxpeHMW0Se_ewoQBwtNODCQ&usqp=CAU', 30, 0, 0, 0, 0)
-- ;

INSERT INTO "5e_ability_scores" ("characterId", "creatureId", "name", "baseValue", "scoreOverride", "scoreMod", "prof")
VALUES
    (1, NULL, 'str', 16, 0, 0, TRUE),
    (1, NULL, 'dex', 14, 0, 0, FALSE),
    (1, NULL, 'con', 16, 0, 0, TRUE),
    (1, NULL, 'int', 8, 0, 0, FALSE),
    (1, NULL, 'wis', 10, 0, 0, FALSE),
    (1, NULL, 'char', 12, 0, 0, FALSE)
;

INSERT INTO "5e_skills" ("characterId", "name", "type", "mod", "prof")
VALUES 
  (1, 'Athletics', 'str', 0, TRUE),
  (1, 'Acrobatics', 'dex', 0, FALSE),
  (1, 'Slight of Hand', 'dex', 0, FALSE),
  (1, 'Stealth', 'dex', 0, FALSE),
  (1, 'Arcana', 'int', 0, FALSE),
  (1, 'History', 'int', 0, FALSE),
  (1, 'Invesigation', 'int', 0, FALSE),
  (1, 'Nature', 'wis', 0, FALSE),
  (1, 'Religion', 'wis', 0, FALSE),
  (1, 'Animal Handling', 'wis', 0, FALSE),
  (1, 'Insight', 'wis', 0, FALSE),
  (1, 'Medicine', 'wis', 0, FALSE),
  (1, 'Perception', 'wis', 0, FALSE),
  (1, 'Survival', 'wis', 0, FALSE),
  (1, 'Deception', 'char', 0, FALSE),
  (1, 'Intimidation', 'char', 0, TRUE),
  (1, 'Performance', 'char', 0, FALSE),
  (1, 'Persuasion', 'char', 0, FALSE)
;

INSERT INTO "5e_maps" ("gameId", "name", "image")
VALUES
    (1, 'Default Map', '/images/maps/default-map.webp'),
    (1, 'Forest', 'https://i.etsystatic.com/18388031/r/il/8b7a49/2796267092/il_fullxfull.2796267092_aezx.jpg')
;
