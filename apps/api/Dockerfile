FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

COPY packages/redis/package.json ./packages/redis/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --no-frozen-lockfile

COPY packages/redis/index.ts ./packages/redis/
COPY packages/redis/tsconfig.json ./packages/redis/
COPY packages/typescript-config ./packages/typescript-config/
COPY packages/types/src ./packages/types/src
COPY packages/types/tsconfig.json ./packages/types/
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/

COPY packages/db/prisma ./packages/db/prisma
COPY packages/db/index.ts ./packages/db/
COPY packages/db/prisma.ts ./packages/db/
COPY packages/db/prisma.config.ts ./packages/db/
COPY packages/db/tsconfig.json ./packages/db/

WORKDIR /app/packages/redis
RUN pnpm build

WORKDIR /app/packages/types
RUN pnpm build

WORKDIR /app/packages/db
RUN pnpm prisma generate
RUN pnpm tsc -b

WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 4000

CMD ["pnpm", "start"]