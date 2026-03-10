FROM node:18-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_IMAGE_URL
ARG NEXT_PUBLIC_NEIS_API_KEY
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_MOCK_SCORE_URL
ARG NEXT_PUBLIC_MOCK_SCORE_API_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_IMAGE_URL
ENV NEXT_PUBLIC_NEIS_API_KEY=$NEXT_PUBLIC_NEIS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_MOCK_SCORE_URL=$NEXT_PUBLIC_MOCK_SCORE_URL
ENV NEXT_PUBLIC_MOCK_SCORE_API_KEY=$NEXT_PUBLIC_MOCK_SCORE_API_KEY

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile
RUN pnpm admin build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

CMD ["node", "apps/admin/server.js"]
