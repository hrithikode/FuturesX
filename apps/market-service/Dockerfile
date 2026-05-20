FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

COPY packages/redis/package.json ./packages/redis/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/market-service/package.json ./apps/market-service/

RUN pnpm install --no-frozen-lockfile

COPY packages/redis/index.ts ./packages/redis/
COPY packages/redis/tsconfig.json ./packages/redis/
COPY packages/typescript-config ./packages/typescript-config/
COPY apps/market-service/src ./apps/market-service/src
COPY apps/market-service/tsconfig.json ./apps/market-service/

WORKDIR /app/packages/redis
RUN pnpm build


WORKDIR /app/apps/market-service
RUN pnpm build

CMD ["pnpm", "start"]