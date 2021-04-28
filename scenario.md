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