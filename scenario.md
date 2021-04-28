Taking an e-commerce application example, an integration test could be checking that the order fulfillment flow is working properly. This means:

- Getting a fake order for a fake customer
- Submitting the order, checking for inventory
- Issuing an invoice
- Sending a confirmation email

That flow relies on the following data to be available in the database:

- 1 customer
- a few products with inventory and price information

- customer can have many orders
- order can have many customers
- product can have many orders
- product can have one category
- category can have many products

## Docker commands

Show running containers
`docker ps`

Show images
`docker images`

Remove the image
`docker rmi <image-id>`

Stop the container
`docker stop <container-id> -t 0`

Remove the container
`docker rm <container-id>`

Create container from docker-compose.yml file
`docker-compose up -d`

Build the container, checks for changes to Dockerfile too
`docker-compose up --build -d`

Destroy the volume(s)
`docker volume prune`

schema:

// Can have 1 customer
// Can have many order details
model Order {
  id           Int            @id @default(autoincrement())
  createdAt    DateTime       @default(now())
  customer     Customer       @relation(fields: [customerId], references: [id])
  customerId   Int
  orderDetails OrderDetails[]
  invoice      Invoice?
}

// Can have 1 order
// Can have many product
model OrderDetails {
  id       Int       @id @default(autoincrement())
  products Product[]
  order    Order     @relation(fields: [orderId], references: [id])
  orderId  Int
  price    Decimal
  quantity Int
}

// Can have many order details
// Can have 1 category
model Product {
  id           Int            @id @default(autoincrement())
  name         String
  description  String
  price        Decimal
  sku          Int
  orderDetails OrderDetails[]
  category     Category       @relation(fields: [categoryId], references: [id])
  categoryId   Int
}

// Can have many products
model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]
}

// Can have many orders
model Customer {
  id      Int     @id @default(autoincrement())
  email   String  @unique
  address String
  name    String
  orders  Order[]
}

// Can have 1 order
model Invoice {
  id      Int   @id @default(autoincrement())
  number  Int   @unique
  order   Order @relation(fields: [orderId], references: [id])
  orderId Int
}

