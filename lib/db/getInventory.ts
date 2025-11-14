import { prisma } from "../prismaClient";

export type inventoryType = {
    name : string,
    qty: number,
    price: number
}
type InventoryResult = {
    success: boolean;
    message: string;
    inventory?: inventoryType[]; // Use a more specific type than 'any' if possible
}

export async function getInventory(shopkeeperId: string): Promise<InventoryResult> {
    if (!shopkeeperId) {
        return { success: false, message: "Shopkeeper ID is missing." };
    }

    try {
        const inventory = await prisma.inventory.findMany({
            where: {
                shopkeeperId: shopkeeperId 
            },
            select: {
                name: true,
                qty: true,
                price: true,
            }
        });

        if (inventory.length === 0) {
             return { 
                 success: true, 
                 message: `No inventory found for shopkeeper ID: ${shopkeeperId}.` 
             };
        }

        return { 
            success: true, 
            message: `Successfully retrieved ${inventory.length} inventory items.`, 
            inventory: inventory 
        };

    } catch (error) {
        console.error("Database error in getInventory:", error);
        return { 
            success: false, 
            message: "A database error occurred while fetching inventory. Please check the logs." 
        };
    }
}