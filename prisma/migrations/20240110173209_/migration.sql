/*
  Warnings:

  - You are about to drop the column `nome` on the `Patients` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Specialties` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Doctors` table. All the data in the column will be lost.
  - Added the required column `name` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Specialties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Doctors` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);
INSERT INTO "new_Patients" ("cpf", "id") SELECT "cpf", "id" FROM "Patients";
DROP TABLE "Patients";
ALTER TABLE "new_Patients" RENAME TO "Patients";
CREATE UNIQUE INDEX "Patients_cpf_key" ON "Patients"("cpf");
CREATE TABLE "new_Specialties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "doctors_id" TEXT NOT NULL,
    CONSTRAINT "Specialties_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Specialties" ("doctors_id", "id") SELECT "doctors_id", "id" FROM "Specialties";
DROP TABLE "Specialties";
ALTER TABLE "new_Specialties" RENAME TO "Specialties";
CREATE TABLE "new_Doctors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL
);
INSERT INTO "new_Doctors" ("crm", "id") SELECT "crm", "id" FROM "Doctors";
DROP TABLE "Doctors";
ALTER TABLE "new_Doctors" RENAME TO "Doctors";
CREATE UNIQUE INDEX "Doctors_crm_key" ON "Doctors"("crm");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
