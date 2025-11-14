import { prisma } from "../prismaClient";
import { inventoryType } from "./getInventory";

type InventoryResult = {
    success: boolean;
    message: string;
    inventory?: inventoryType[]; 
}

export async function getInventoryByName(productName: string): Promise<InventoryResult> {
    if (!productName || typeof productName !== 'string') {
        return { 
            success: false, 
            message: "Product name is missing or invalid." 
        };
    }

    try {
        const inventory = await prisma.inventory.findMany({
            where: {
                name: {
                    contains: productName, 
                    mode: 'insensitive', 
                }
            }
        });

        if (inventory.length === 0) {
            return {
                success: true, 
                message: `No inventory found matching '${productName}'.`
            };
        }

        return { 
            success: true, 
            message: `Found ${inventory.length} item(s) matching '${productName}'.`, 
            inventory: inventory 
        };

    } catch (error) {
        console.error("Prisma Error during inventory lookup:", error); 
        
        return { 
            success: false, 
            message: "An internal system error occurred while searching the inventory. Please check the backend logs." 
        };
    }
}