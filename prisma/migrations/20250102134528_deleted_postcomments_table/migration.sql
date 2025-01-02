/*
  Warnings:

  - You are about to drop the `PostComments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comment_to` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostComments" DROP CONSTRAINT "PostComments_message_id_fkey";

-- DropForeignKey
ALTER TABLE "PostComments" DROP CONSTRAINT "PostComments_sender_id_fkey";

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "comment_to" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PostComments";

-- CreateIndex
CREATE INDEX "Messages_comment_to_idx" ON "Messages"("comment_to");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_comment_to_fkey" FOREIGN KEY ("comment_to") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
