/*
  Warnings:

  - A unique constraint covering the columns `[hash,gclientid]` on the table `marketing_tracking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "marketing_tracking_hash_gclientid_key" ON "marketing_tracking"("hash", "gclientid");
