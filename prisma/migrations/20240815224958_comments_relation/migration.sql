/*
  Warnings:

  - You are about to drop the column `userType` on the `Comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Comment_commentId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userType",
ALTER COLUMN "studentId" DROP NOT NULL,
ALTER COLUMN "collegeId" DROP NOT NULL;
