FROM node:14

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

RUN npx prisma generate
RUN yarn migrate

EXPOSE 5432

