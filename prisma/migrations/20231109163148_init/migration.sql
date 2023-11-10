-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "anilist_id" INT4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaReview" (
    "id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "media_id" INT4 NOT NULL,
    "type" STRING NOT NULL,
    "unit" FLOAT8 NOT NULL,
    "rating" FLOAT8 NOT NULL,
    "comment" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterReview" (
    "id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "character_id" INT4 NOT NULL,
    "rating" FLOAT8 NOT NULL,
    "comment" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_anilist_id_key" ON "User"("anilist_id");

-- AddForeignKey
ALTER TABLE "MediaReview" ADD CONSTRAINT "MediaReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterReview" ADD CONSTRAINT "CharacterReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
