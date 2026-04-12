-- AlterTable: make phone and password nullable, add googleId for Google OAuth
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key_new" ON "User"("phone") WHERE "phone" IS NOT NULL;
DROP INDEX "User_phone_key";
ALTER INDEX "User_phone_key_new" RENAME TO "User_phone_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
