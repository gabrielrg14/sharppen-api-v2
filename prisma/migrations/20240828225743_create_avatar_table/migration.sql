/*
  Warnings:

  - You are about to drop the column `imagePath` on the `College` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "College" DROP COLUMN "imagePath";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "imagePath";

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "fieldname" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalname" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT,
    "collegeId" TEXT,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_studentId_key" ON "Avatar"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_collegeId_key" ON "Avatar"("collegeId");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
