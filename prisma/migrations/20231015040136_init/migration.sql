-- CreateTable
CREATE TABLE "Review" (
    "review_id" STRING NOT NULL,
    "id" INT4 NOT NULL,
    "type" STRING NOT NULL,
    "rating" FLOAT8 NOT NULL,
    "comment" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);
