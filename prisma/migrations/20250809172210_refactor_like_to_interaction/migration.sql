/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Like";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Interaction" (
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("fromId", "toId"),
    CONSTRAINT "Interaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Interaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Interaction_fromId_idx" ON "Interaction"("fromId");

-- CreateIndex
CREATE INDEX "Interaction_toId_idx" ON "Interaction"("toId");

-- CreateIndex
CREATE INDEX "Interaction_type_idx" ON "Interaction"("type");
