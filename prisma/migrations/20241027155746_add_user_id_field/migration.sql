/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incident_updates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incidents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- DropForeignKey
ALTER TABLE "incident_updates" DROP CONSTRAINT "incident_updates_incidentId_fkey";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "incident_updates";

-- DropTable
DROP TABLE "incidents";

-- DropEnum
DROP TYPE "IncidentStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
