FROM node:22-alpine AS build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/nest-cli.json backend/tsconfig*.json ./
COPY backend/src ./src
RUN npm run build

FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public
COPY storage ./storage

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
