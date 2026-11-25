FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public" npx prisma generate

COPY . .

RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update && apt-get install -y openssl

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
