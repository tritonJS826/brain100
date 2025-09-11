#1 Stage 1: build
FROM node:22.5.1-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY pt-web/package.json .
COPY pt-web/pnpm-lock.yaml .
RUN npm i -g pnpm@8.15.2
RUN pnpm install --frozen-lockfile
COPY pt-web .
RUN chmod +x deploy/addSolToBuild.sh
RUN pnpm run build

# Stage 2: production
FROM node:22.5.1-alpine AS production
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./

EXPOSE 5173
CMD ["npx", "serve", "-s", "build", "-l", "5174"]
