FROM node:20-alpine

WORKDIR /app

COPY apps/client/.next/standalone ./
COPY apps/client/.next/static ./apps/client/.next/static
COPY apps/client/public ./apps/client/public

CMD ["node", "apps/client/server.js"]
