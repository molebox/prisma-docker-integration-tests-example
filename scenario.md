Taking an e-commerce application example, an integration test could be checking that the order fulfillment flow is working properly. This means:

- Getting a fake order for a fake customer
- Submitting the order, checking for inventory
- Issuing an invoice

That flow relies on the following data to be available in the database:

- 1 customer
- a few products with inventory and price information

## Docker commands

Show running containers
`docker ps`

Show all containers
`docker container ls -a`

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

- manually before all: start database server
- manually before all: run a migration
- manually before all: kick off jest with --runInBand to prevent any parallelism of test suites (in CI user can take advantage of GH matrix - to get parallelism back there) this is just the -i flag, which you already do
- jest before each: seed the db
- jest test
- jest after each: empty db tables
- manually after all: shut down database server

Running order:
- yarn docker:up - creates container and db
- yarn migrate - runs migration on db and creates tables according to schema
- yarn test


Use quotes inside the rawQuery - 
https://github.com/prisma/prisma-client-js/issues/595