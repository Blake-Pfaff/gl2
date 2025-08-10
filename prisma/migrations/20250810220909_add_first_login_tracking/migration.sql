-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "jobTitle" TEXT,
    "bio" TEXT,
    "birthdate" DATETIME,
    "phone" TEXT,
    "gender" TEXT,
    "lookingFor" TEXT,
    "lastOnlineAt" DATETIME,
    "locationLabel" TEXT,
    "hashedPassword" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstLoginAt" DATETIME,
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("bio", "birthdate", "createdAt", "email", "gender", "hashedPassword", "id", "jobTitle", "lastOnlineAt", "locationLabel", "lookingFor", "name", "phone", "username") SELECT "bio", "birthdate", "createdAt", "email", "gender", "hashedPassword", "id", "jobTitle", "lastOnlineAt", "locationLabel", "lookingFor", "name", "phone", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
