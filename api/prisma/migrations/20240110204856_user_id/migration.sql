-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "user_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Patients" ("cpf", "id", "name") SELECT "cpf", "id", "name" FROM "Patients";
DROP TABLE "Patients";
ALTER TABLE "new_Patients" RENAME TO "Patients";
CREATE UNIQUE INDEX "Patients_cpf_key" ON "Patients"("cpf");
CREATE TABLE "new_Appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "patients_id" TEXT NOT NULL DEFAULT '',
    "doctors_id" TEXT NOT NULL DEFAULT '',
    "usersId" TEXT,
    CONSTRAINT "Appointments_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "Patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Appointments" ("date", "doctors_id", "id", "patients_id") SELECT "date", "doctors_id", "id", "patients_id" FROM "Appointments";
DROP TABLE "Appointments";
ALTER TABLE "new_Appointments" RENAME TO "Appointments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
