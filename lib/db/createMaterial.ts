import { prisma } from "../prismaClient";

export async function createNewProduct(shopkeeperId: string, productName: string, qty: number, price: number) {
    const normalizedName = productName.trim().toLowerCase(); 

    const existingProduct = await prisma.inventory.findFirst({
        where: {
            shopkeeperId: shopkeeperId,
            name: {
                contains: normalizedName,
                mode: 'insensitive', 
            }
        }
    });

    if (existingProduct) {
        return {
            success: false, 
            message: `A similar product ('${existingProduct.name}') already exists. Did you mean to update the stock?`,
            existingId: existingProduct.id
        };
    }

    const newProduct = await prisma.inventory.create({
        data: {
            shopkeeperId: shopkeeperId,
            name: normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1), 
            qty: qty,
            price: price,
        }
    });

    return {
        success: true, 
        message: `Successfully created new product: ${newProduct.name}.`,
        product: newProduct
    };
}