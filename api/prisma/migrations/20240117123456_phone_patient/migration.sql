-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Patients" ("cpf", "id", "name", "user_id") SELECT "cpf", "id", "name", "user_id" FROM "Patients";
DROP TABLE "Patients";
ALTER TABLE "new_Patients" RENAME TO "Patients";
CREATE UNIQUE INDEX "Patients_cpf_key" ON "Patients"("cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
