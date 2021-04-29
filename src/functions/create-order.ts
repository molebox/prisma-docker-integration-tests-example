import prisma from '../client';

export interface Customer {
    id?: number;
    name: string;
    email: string;
    address: string;
}

export interface OrderInput {
    customer: Customer;
    productId: number;
    quantity: number;
}

/**
 * Creates an order and returns an invoice.
 * @param input The order parameters
 * @returns An invoice
 */
export async function createOrderNewCustomer(input: OrderInput) {
    const { productId, quantity, customer } = input;
    const { name, email, address } = customer;

    // Get the product
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });

    // If the product is null its out of stock, return null.
    if (!product) return null;

    // Create a new invoice with the order
    return await prisma.invoice.create({
        data: {
            number: 1,
            order: {
                create: {
                    customer: {
                        create: {
                            name, 
                            email,
                            address
                        }
                    },
                    orderDetails: {
                        create: {
                            total: product.price,
                            quantity,
                            products: {
                                connect: {
                                    id: product.id,

                                }
                            }
                        }
                    }
                }
            }
        }
    });
}