/*
  Warnings:

  - A unique constraint covering the columns `[user_id,token]` on the table `JwtTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JwtTokens_user_id_token_key" ON "JwtTokens"("user_id", "token");
