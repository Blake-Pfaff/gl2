-- CreateTable
CREATE TABLE "OnboardingStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingStep_stepNumber_key" ON "OnboardingStep"("stepNumber");

-- CreateIndex
CREATE INDEX "OnboardingStep_stepNumber_idx" ON "OnboardingStep"("stepNumber");
