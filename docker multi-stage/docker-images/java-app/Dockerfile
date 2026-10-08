# Stage 1: Compile Java source code
FROM openjdk:17-alpine AS builder
WORKDIR /app
COPY Main.java .
RUN javac Main.java

# Stage 2: Copy compiled bytecode and run
FROM openjdk:17-alpine
WORKDIR /app
COPY --from=builder /app/Main.class .
EXPOSE 8080
CMD ["java", "Main"]
