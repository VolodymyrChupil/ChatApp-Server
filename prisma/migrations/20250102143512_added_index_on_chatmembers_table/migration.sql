-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_comment_to_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_forwarded_from_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_reply_to_fkey";

-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "forwarded_from" DROP NOT NULL,
ALTER COLUMN "reply_to" DROP NOT NULL,
ALTER COLUMN "comment_to" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ChatMembers_chat_id_idx" ON "ChatMembers"("chat_id");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_forwarded_from_fkey" FOREIGN KEY ("forwarded_from") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_reply_to_fkey" FOREIGN KEY ("reply_to") REFERENCES "Messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_comment_to_fkey" FOREIGN KEY ("comment_to") REFERENCES "Messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
