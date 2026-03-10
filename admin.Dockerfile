FROM node:20-alpine

WORKDIR /app

COPY apps/admin/.next/standalone ./
COPY apps/admin/.next/static ./apps/admin/.next/static
COPY apps/admin/public ./apps/admin/public

CMD ["node", "apps/admin/server.js"]
