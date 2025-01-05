-- CreateTable
CREATE TABLE "BlockedUsers" (
    "blocker_id" TEXT NOT NULL,
    "blocked_id" TEXT NOT NULL,

    CONSTRAINT "BlockedUsers_pkey" PRIMARY KEY ("blocked_id","blocker_id")
);

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
