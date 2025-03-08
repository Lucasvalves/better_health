/*
  Warnings:

  - You are about to drop the column `specialties` on the `Doctors` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Specialties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "specialties" TEXT NOT NULL DEFAULT ''
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "patients_id" TEXT NOT NULL DEFAULT '',
    "specialties_id" TEXT NOT NULL DEFAULT '',
    "doctors_id" TEXT NOT NULL DEFAULT '',
    "users_id" TEXT,
    CONSTRAINT "Appointments_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "Patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_specialties_id_fkey" FOREIGN KEY ("specialties_id") REFERENCES "Specialties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Appointments" ("date", "doctors_id", "id", "patients_id", "users_id") SELECT "date", "doctors_id", "id", "patients_id", "users_id" FROM "Appointments";
DROP TABLE "Appointments";
ALTER TABLE "new_Appointments" RENAME TO "Appointments";
CREATE TABLE "new_Doctors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "specialties_id" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Doctors_specialties_id_fkey" FOREIGN KEY ("specialties_id") REFERENCES "Specialties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Doctors" ("crm", "id", "name", "user_id") SELECT "crm", "id", "name", "user_id" FROM "Doctors";
DROP TABLE "Doctors";
ALTER TABLE "new_Doctors" RENAME TO "Doctors";
CREATE UNIQUE INDEX "Doctors_crm_key" ON "Doctors"("crm");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
