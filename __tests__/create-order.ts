import prisma from "../src/client";
import { createOrder, Customer, OrderInput } from "../src/functions/index";

beforeAll(async () => {
    // create product categories
    await prisma.category.createMany({
      data: [{ name: "Wand" }, { name: "Broomstick" }],
    });
  
    console.log("✨ 2 categories successfully created!");
  
    // create products
    await prisma.product.createMany({
      data: [
        {
          name: 'Holly, 11", phoenix feather',
          description: "Harry Potters wand",
          price: 100,
          sku: 1,
          categoryId: 1,
        },
        {
          name: "Nimbus 2000",
          description: "Harry Potters broom",
          price: 500,
          sku: 2,
          categoryId: 2,
        },
      ],
    });
  
    console.log("✨ 2 products successfully created!");
  
    // create the customer
    await prisma.customer.create({
      data: {
        name: "Harry Potter",
        email: "harry@hogwarts.io",
        address: "4 Privet Drive",
      },
    });
  
    console.log("✨ 1 customer successfully created!");
});

afterAll(async () => {
  for (const {
    tablename,
  } of await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) {
    
      if (tablename !== '_prisma_migrations') {
        await prisma.$queryRaw(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    }
  }

  await prisma.$disconnect();
});

it("should create 1 new customer with 1 order", async (done) => {
  // The new customers details
  const customer: Customer = {
    id: 2,
    name: "Hermione Granger",
    email: "hermione@hogwarts.io",
    address: "2 Hampstead Heath",
  };
  // The new orders details
  const order: OrderInput = {
    customer,
    productId: 1,
    quantity: 1,
  };

  // Create the order and customer
  await createOrder(order);

  // Check if the new customer was created by filtering on unique email field
  const newCustomer = await prisma.customer.findUnique({
    where: {
      email: customer.email,
    },
  });

  // Check if the new order was created by filtering on unique email field of the customer
  const newOrder = await prisma.order.findFirst({
    where: {
      customer: {
        email: customer.email,
      },
    },
  });

  // Expect the new customer to have been created and match the input
  expect(newCustomer).toEqual(customer);
  // Expect the new order to have been created and contain the new customer
  expect(newOrder).toHaveProperty("customerId", 2);

  done()
});

it("should create 1 order with an existing customer", async (done) => {
  // The existing customers email
  const customer: Customer = {
    email: "harry@hogwarts.io",
  };
  // The new orders details
  const order: OrderInput = {
    customer,
    productId: 1,
    quantity: 1,
  };

  // Create the order and connect the existing customer
  await createOrder(order);

  // Check if the new order was created by filtering on unique email field of the customer
  const newOrder = await prisma.order.findFirst({
    where: {
      customer: {
        email: customer.email,
      },
    },
  });

  // Expect the new order to have been created and contain the existing customer with an id of 1 (Harry Potter from the seed script)
  expect(newOrder).toHaveProperty("customerId", 1);

  done()
});

