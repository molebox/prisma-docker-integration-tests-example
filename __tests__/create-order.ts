import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

afterAll(async () => {
    await prisma.$disconnect();
});

it('should create 1 new order and an invoice', async () => {

        // Create a new wand order and invoice, linked to a customer.
        await prisma.order.create({
            data: {
               customer: {
                   connect: {
                       email: 'hello@hogwarts.io'
                   }
               },
               invoice: {
                   create: {
                       number: 1
                    }
               },
               orderDetails: {
                    create: {
                        quantity: 1,
                        total: 100
                    }
               }
            }
        });

        const order = await prisma.order.findFirst();
        const invoice = await prisma.invoice.findFirst();

        expect(order).toBeTruthy();
        expect(invoice?.number).toBe(1)
      
})