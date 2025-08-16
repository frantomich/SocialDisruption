-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "avatar" TEXT,
    "birthday" DATETIME NOT NULL,
    "country" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "birthday", "country", "created_at", "email", "id", "lastname", "name", "password", "relationship", "updated_at") SELECT "avatar", "birthday", "country", "created_at", "email", "id", "lastname", "name", "password", "relationship", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
