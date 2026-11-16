-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "specialties_id" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "patients_id" TEXT NOT NULL DEFAULT '',
    "specialties_id" TEXT NOT NULL DEFAULT '',
    "doctors_id" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Times" (
    "id" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startHour" TIMESTAMP(3) NOT NULL,
    "endHour" TIMESTAMP(3) NOT NULL,
    "doctors_id" TEXT NOT NULL DEFAULT '',
    "specialties_id" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Times_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_cpf_key" ON "Patients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Specialties_name_key" ON "Specialties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Doctors_crm_key" ON "Doctors"("crm");

-- AddForeignKey
ALTER TABLE "Patients" ADD CONSTRAINT "Patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_specialties_id_fkey" FOREIGN KEY ("specialties_id") REFERENCES "Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "Patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_specialties_id_fkey" FOREIGN KEY ("specialties_id") REFERENCES "Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_doctors_id_fkey" FOREIGN KEY ("doctors_id") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_specialties_id_fkey" FOREIGN KEY ("specialties_id") REFERENCES "Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
