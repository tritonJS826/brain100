-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "isFinished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stats" JSONB,
ALTER COLUMN "userId" DROP NOT NULL;
