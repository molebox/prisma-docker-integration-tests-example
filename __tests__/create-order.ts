import prisma from "../src/client";
import { createOrder, Customer, OrderInput } from "../src/functions/index";
import { PrismaPromise } from "@prisma/client";

beforeAll(async () => {
  console.log(process.env.DATABASE_URL)
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
  // for (const {
  //   tablename,
  // } of await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) {

  //     if (tablename !== '_prisma_migrations') {
  //       await prisma.$queryRaw(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
  //   }
  // }

  // const transactions: PrismaPromise<any>[] = [];
  //   transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`)

  //   for (const { TABLE_NAME } of await prisma.$queryRaw`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'tests';`) {
  //     if (TABLE_NAME !== "_prisma_migrations") {
  //       try {
  //         transactions.push(prisma.$executeRaw(
  //           `TRUNCATE ${TABLE_NAME};`
  //         ));
  //       } catch (error) {
  //         console.log({error})
  //       }
  //     }
  //   }

  //   transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  //   try {
  //     await prisma.$transaction(transactions);
  //   } catch (error) {
  //     console.log({error})
  //   }

  const deleteProduct = prisma.product.deleteMany();
  const deleteCategory = prisma.category.deleteMany();
  const deleteOrderDetails = prisma.orderDetails.deleteMany();
  const deleteCustomerOrder = prisma.customerOrder.deleteMany();
  const deleteCustomer = prisma.customer.deleteMany();

  await prisma.$transaction([
    deleteOrderDetails,
    deleteProduct,
    deleteCategory,
    deleteCustomerOrder,
    deleteCustomer
  ])

  await prisma.$disconnect();

  // await prisma.$disconnect();
});

it("should create 1 new customer with 1 order", async () => {
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
  const newOrder = await prisma.customerOrder.findFirst({
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
});

it("should create 1 order with an existing customer", async () => {
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
  const newOrder = await prisma.customerOrder.findFirst({
    where: {
      customer: {
        email: customer.email,
      },
    },
  });

  // Expect the new order to have been created and contain the existing customer with an id of 1 (Harry Potter from the seed script)
  expect(newOrder).toHaveProperty("customerId", 1);
});

it("should show 'Out of stock' message if productId doesn't exit", async () => {
  // The existing customers email
  const customer: Customer = {
    email: "harry@hogwarts.io",
  };
  // The new orders details
  const order: OrderInput = {
    customer,
    productId: 3,
    quantity: 1,
  };

  // The productId supplied doesnt exit so the function should return an "Out of stock" message
  await expect(createOrder(order)).resolves.toEqual(new Error("Out of stock"));
});
