/*
  Warnings:

  - You are about to drop the column `productId` on the `OrderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderDetails` table. All the data in the column will be lost.
  - Added the required column `total` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_productId_fkey";

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "productId",
DROP COLUMN "price",
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "_OrderDetailsToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderDetailsToProduct_AB_unique" ON "_OrderDetailsToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderDetailsToProduct_B_index" ON "_OrderDetailsToProduct"("B");

-- AddForeignKey
ALTER TABLE "_OrderDetailsToProduct" ADD FOREIGN KEY ("A") REFERENCES "OrderDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderDetailsToProduct" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
