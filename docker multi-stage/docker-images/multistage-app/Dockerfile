# Stage 1: Copy index.html in an alpine builder container
FROM alpine:latest AS builder
WORKDIR /app
COPY index.html .

# Stage 2: Copy index.html to nginx web root and expose port 80
FROM nginx:alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
