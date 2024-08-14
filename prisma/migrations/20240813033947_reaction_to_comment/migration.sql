-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "commentId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL,
ALTER COLUMN "collegeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
