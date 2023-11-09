/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Review";

-- CreateTable
CREATE TABLE "MediaReview" (
    "review_id" STRING NOT NULL,
    "id" INT4 NOT NULL,
    "type" STRING NOT NULL,
    "unit" FLOAT8 NOT NULL,
    "rating" FLOAT8 NOT NULL,
    "comment" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaReview_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "CharacterReview" (
    "review_id" STRING NOT NULL,
    "id" INT4 NOT NULL,
    "rating" FLOAT8 NOT NULL,
    "comment" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterReview_pkey" PRIMARY KEY ("review_id")
);
