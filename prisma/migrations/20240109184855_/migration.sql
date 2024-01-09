/*
  Warnings:

  - You are about to drop the `Consulta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Especialidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paciente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Consulta";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Especialidade";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Medico";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Paciente";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pacientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Medicos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "crm" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Especialidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "medicoId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Consultas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "pacientes_id" TEXT NOT NULL DEFAULT '',
    "medicos_id" TEXT NOT NULL DEFAULT '',
    "especialidades_id" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Consultas_pacientes_id_fkey" FOREIGN KEY ("pacientes_id") REFERENCES "Pacientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consultas_medicos_id_fkey" FOREIGN KEY ("medicos_id") REFERENCES "Medicos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consultas_especialidades_id_fkey" FOREIGN KEY ("especialidades_id") REFERENCES "Especialidades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consultas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pacientes_cpf_key" ON "Pacientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Medicos_crm_key" ON "Medicos"("crm");
