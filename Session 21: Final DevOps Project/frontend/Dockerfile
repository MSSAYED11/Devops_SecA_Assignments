FROM node:22-alpine AS build
WORKDIR /app
LABEL maintainer="M S Sayed <mssayed1108@gmail.com>"
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
LABEL maintainer="M S Sayed <mssayed1108@gmail.com>"

USER root
RUN apk update && apk upgrade --no-cache
USER 101

COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
