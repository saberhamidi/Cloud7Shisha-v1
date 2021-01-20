FROM node:8.11.1 AS builder
WORKDIR app
COPY . .
RUN npm install
RUN npm cache verify
RUN npm run build --aot --prod --output-hashing none

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html