import { prisma } from "../prismaClient";
import { inventoryType } from "./getInventory";

type UpdateStockResult = {
    success: boolean;
    message: string;
    updatedRecord?: inventoryType;
};

export async function updateProductStock(productName: string, shopkeeperId: string, quantityChange: number): Promise<UpdateStockResult> {
    if (!productName || typeof quantityChange !== 'number') {
        return { success: false, message: "Invalid product name or quantity change provided." };
    }

    try {
        // Step 1: Find the product using flexible matching (Partial Match)
        const matchingProducts = await prisma.inventory.findMany({
            where: {
                shopkeeperId: shopkeeperId,
                name: {
                    contains: productName, 
                    mode: 'insensitive', 
                }
            }
        });

        if (matchingProducts.length === 0) {
            return { success: false, message: `Could not find any product matching '${productName}'.` };
        }
        
        if (matchingProducts.length > 1) {
             // You would typically send this message back to the LLM
             return { 
                 success: false, 
                 message: `Found ${matchingProducts.length} items. Please be more specific (e.g., 'Update the stock for ${matchingProducts[0].name}').` 
             };
        }

        const productToUpdate = matchingProducts[0];
        const newQuantity = productToUpdate.qty + quantityChange;
        const updatedProduct = await prisma.inventory.update({
            where: {
                id: productToUpdate.id, // Use the unique ID found in Step 1
            },
            data: {
                qty: newQuantity, // Calculate the new quantity
            },
        });

        return { 
            success: true, 
            message: `Successfully updated stock for ${updatedProduct.name}. New quantity is ${updatedProduct.qty}.`, 
            updatedRecord: updatedProduct 
        };

    } catch (error) {
        console.error("Prisma Error during stock update:", error);
        return { 
            success: false, 
            message: "A database error occurred while trying to update the stock." 
        };
    }
}