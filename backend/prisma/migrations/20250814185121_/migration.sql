/*
  Warnings:

  - The primary key for the `Friendship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `requested` on the `Friendship` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `requester` on the `Friendship` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `author` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friendship" (
    "requester" INTEGER NOT NULL,
    "requested" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("requester", "requested"),
    CONSTRAINT "Friendship_requester_fkey" FOREIGN KEY ("requester") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Friendship_requested_fkey" FOREIGN KEY ("requested") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Friendship" ("created_at", "requested", "requester", "status", "updated_at") SELECT "created_at", "requested", "requester", "status", "updated_at" FROM "Friendship";
DROP TABLE "Friendship";
ALTER TABLE "new_Friendship" RENAME TO "Friendship";
CREATE INDEX "Friendship_requester_requested_idx" ON "Friendship"("requester", "requested");
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("author", "content", "created_at", "id") SELECT "author", "content", "created_at", "id" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_author_idx" ON "Post"("author");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "avatar" BLOB,
    "birthday" DATETIME NOT NULL,
    "country" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "birthday", "country", "created_at", "email", "lastname", "name", "password", "relationship", "updated_at") SELECT "avatar", "birthday", "country", "created_at", "email", "lastname", "name", "password", "relationship", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
