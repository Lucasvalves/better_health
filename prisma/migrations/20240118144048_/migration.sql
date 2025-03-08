/*
  Warnings:

  - You are about to drop the column `specialties` on the `Specialties` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Specialties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Specialties" ("id", "name") SELECT "id", "name" FROM "Specialties";
DROP TABLE "Specialties";
ALTER TABLE "new_Specialties" RENAME TO "Specialties";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
