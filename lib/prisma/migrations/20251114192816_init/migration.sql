-- CreateTable
CREATE TABLE "shopkeepers" (
    "id" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,

    CONSTRAINT "shopkeepers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "shopkeeperId" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopkeepers_mail_key" ON "shopkeepers"("mail");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_shopkeeperId_fkey" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
