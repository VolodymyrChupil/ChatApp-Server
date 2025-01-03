/*
  Warnings:

  - You are about to drop the column `last_logged` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `show_last_logged` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "last_logged" TIMESTAMP(3),
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_last_logged" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "last_logged",
DROP COLUMN "show_last_logged";
