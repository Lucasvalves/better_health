/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Specialties` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Specialties_name_key" ON "Specialties"("name");
