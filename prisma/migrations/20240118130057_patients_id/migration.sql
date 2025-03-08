-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "patients_id" TEXT NOT NULL DEFAULT '',
    "doctors_id" TEXT NOT NULL DEFAULT '',
    "users_id" TEXT,
    CONSTRAINT "Appointments_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "Patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointments_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Appointments" ("date", "doctors_id", "id", "users_id") SELECT "date", "doctors_id", "id", "users_id" FROM "Appointments";
DROP TABLE "Appointments";
ALTER TABLE "new_Appointments" RENAME TO "Appointments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
