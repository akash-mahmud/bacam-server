-- CreateTable
CREATE TABLE "Home" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "keywords" TEXT,
    "bannerUrl" TEXT,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);
