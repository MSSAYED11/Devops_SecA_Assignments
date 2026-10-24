FROM node:22-alpine AS build
WORKDIR /app
LABEL maintainer="M S Sayed <mssayed1108@gmail.com>"
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:1.27-alpine
LABEL maintainer="M S Sayed <mssayed1108@gmail.com>"

# Configure nginx to run as non-root user
RUN sed -i 's|^user |#user |' /etc/nginx/nginx.conf && \
    sed -i 's|.*pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf && \
    mkdir -p /var/cache/nginx /var/log/nginx /usr/share/nginx/html /tmp /var/run && \
    touch /tmp/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html /tmp /var/run

COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080
