/*
  Warnings:

  - You are about to drop the `Specialties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `specialties_id` on the `Appointments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Appointments` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Specialties";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "patients_id" TEXT NOT NULL DEFAULT '',
    "doctors_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Appointments_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "Patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointments" ("date", "doctors_id", "id", "patients_id") SELECT "date", "doctors_id", "id", "patients_id" FROM "Appointments";
DROP TABLE "Appointments";
ALTER TABLE "new_Appointments" RENAME TO "Appointments";
CREATE TABLE "new_Doctors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "specialties" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Doctors" ("crm", "id", "name") SELECT "crm", "id", "name" FROM "Doctors";
DROP TABLE "Doctors";
ALTER TABLE "new_Doctors" RENAME TO "Doctors";
CREATE UNIQUE INDEX "Doctors_crm_key" ON "Doctors"("crm");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
