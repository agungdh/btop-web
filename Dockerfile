FROM oven/bun:alpine AS build

WORKDIR /app

COPY package.json bun.lock .npmrc ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
