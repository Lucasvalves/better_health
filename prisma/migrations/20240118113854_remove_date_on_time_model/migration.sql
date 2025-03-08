/*
  Warnings:

  - You are about to drop the column `date` on the `Time` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Time" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "days" INTEGER NOT NULL,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startHour" DATETIME NOT NULL,
    "endHour" DATETIME NOT NULL,
    "doctors_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Time_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Time" ("days", "doctors_id", "endHour", "id", "registrationDate", "startHour") SELECT "days", "doctors_id", "endHour", "id", "registrationDate", "startHour" FROM "Time";
DROP TABLE "Time";
ALTER TABLE "new_Time" RENAME TO "Time";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
