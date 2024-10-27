/*
  Warnings:

  - The primary key for the `incident_updates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `incident_updates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `incidents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `incidents` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `incidentId` on the `incident_updates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "incident_updates" DROP CONSTRAINT "incident_updates_incidentId_fkey";

-- AlterTable
ALTER TABLE "incident_updates" DROP CONSTRAINT "incident_updates_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "incidentId",
ADD COLUMN     "incidentId" INTEGER NOT NULL,
ADD CONSTRAINT "incident_updates_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "incidents_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "incident_updates" ADD CONSTRAINT "incident_updates_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
