import prisma from '../src/client';

/**
 * A seed function to insert data into the database for running test against.
 */
async function seed() {

    // Check if the database already has data. This could be due to a test failing and the container not being destroyed, thus leaving data in the database
    const hasData = await prisma.customer.findFirst();

    if (hasData) {
        console.log('The database has data. Skipping seed.')
        return;
    }

    // create product categories
    await prisma.category.createMany({
        data: [
           { name: 'Wand' },
           { name: 'Broomstick' }
        ]
    })

    console.log('✨ 2 product categories successfully created!')

    // create products
    await prisma.product.createMany({
        data: [
            {
                name: 'Holly, 11", phoenix feather',
                description: 'Harry Potters wand',
                price: 100,
                sku: 1,
                categoryId: 1
            },
            {
                name: 'Nimbus 2000',
                description: 'Harry Potters broom',
                price: 500,
                sku: 2,
                categoryId: 2
            }
        ]
    })

    console.log('✨ 2 products successfully created!')

    // create the customer
    await prisma.customer.create({
        data: {
            name: 'Harry',
            email: 'harry@hogwarts.io',
            address: '4 Privet Drive',
        }
    })

    console.log('✨ 1 customer successfully created!')
}

// Seed the database then disconnect
seed()
    .catch((error) => console.log({error}))
    .finally(async () => {
        await prisma.$disconnect()
    })