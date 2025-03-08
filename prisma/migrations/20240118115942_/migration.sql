/*
  Warnings:

  - You are about to drop the `Time` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Time";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "days" INTEGER NOT NULL,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startHour" DATETIME NOT NULL,
    "endHour" DATETIME NOT NULL,
    "doctors_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Times_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
