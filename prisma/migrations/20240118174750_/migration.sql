-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "days" INTEGER NOT NULL,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startHour" DATETIME NOT NULL,
    "endHour" DATETIME NOT NULL,
    "doctors_id" TEXT NOT NULL DEFAULT '',
    "specialties_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Times_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Times_specialties_id_fkey" FOREIGN KEY ("specialties_id") REFERENCES "Specialties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Times" ("days", "doctors_id", "endHour", "id", "registrationDate", "startHour") SELECT "days", "doctors_id", "endHour", "id", "registrationDate", "startHour" FROM "Times";
DROP TABLE "Times";
ALTER TABLE "new_Times" RENAME TO "Times";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
