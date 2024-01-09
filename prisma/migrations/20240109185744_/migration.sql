/*
  Warnings:

  - You are about to drop the column `medicoId` on the `Especialidades` table. All the data in the column will be lost.
  - Added the required column `medicos_id` to the `Especialidades` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Especialidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "medicos_id" TEXT NOT NULL,
    CONSTRAINT "Especialidades_medicos_id_fkey" FOREIGN KEY ("medicos_id") REFERENCES "Medicos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Especialidades" ("descricao", "id") SELECT "descricao", "id" FROM "Especialidades";
DROP TABLE "Especialidades";
ALTER TABLE "new_Especialidades" RENAME TO "Especialidades";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
