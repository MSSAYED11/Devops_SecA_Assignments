# Docker Multi-Stage Build Homework

**Name:** M S Sayed
**Enrollment Number:** 24BCS10396

---

## Task 1 & 2: Multi-Stage Dockerfile Execution & Verification

### 1. Multi-Stage Dockerfile (`multistage-app/Dockerfile`)

For this task, I created a Dockerfile with two stages. The first stage is used to prepare the application files, and the second stage uses Nginx to actually run the application.

```dockerfile
# Stage 1: Build stage
FROM alpine:latest AS builder
WORKDIR /app
COPY index.html .

# Stage 2: Runtime environment
FROM nginx:alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

The main thing I understood here is that I don't need to keep the first image as the final runtime environment. I can use the first stage for the required files and then copy only what I need into the second stage.

### 2. Checking the Application Output

After running the container, I checked the application using `curl`:

```bash
$ curl http://localhost:8080
<h1>Hello World from Docker multi-stage build</h1>
```

The output came correctly, so the application was running properly.

### 3. Checking the Container

I also used `docker ps` to make sure the container was actually running:

```text
CONTAINER ID   IMAGE             COMMAND                  CREATED          STATUS          PORTS                                   NAMES
8b053383b99e   multistage-demo   "/docker-entrypoint.…"   52 seconds ago   Up 52 seconds   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp multistage-container
```

From this, I could see that the container was up and port `8080` on my system was mapped to port `80` inside the container.

---

## Task 3: Multi-Stage Application Deployments

For this task, I tried the multi-stage approach with Node.js, Python and Java applications.

### 1. Node.js Multi-Stage Deployment (`nodejs-app/Dockerfile`)

For the Node.js application, I used one stage for installing the dependencies and preparing the application, and another stage for running it.

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["node", "server.js"]
```

Here the `build` stage installs the required npm packages and copies the application files. Then I copy the prepared application into the `production` stage.

---

### 2. Python Multi-Stage Deployment (`python-app/Dockerfile`)

For Python, I used the first stage to install the packages from `requirements.txt` and then copied them into the final image.

```dockerfile
FROM python:3.9-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.9-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY app.py .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 5000
CMD ["python", "app.py"]
```

I used `pip install --user` in the first stage and then copied the installed packages to the final image. The `PATH` is also updated so that Python can find the installed packages.

---

### 3. Java Multi-Stage Deployment (`java-app/Dockerfile`)

For the Java application, the first stage is mainly used for compiling the Java file. The final stage only needs the compiled `.class` file to run the application.

```dockerfile
FROM openjdk:17-alpine AS compiler
WORKDIR /app
COPY Main.java .
RUN javac Main.java

FROM openjdk:17-alpine
WORKDIR /app
COPY --from=compiler /app/Main.class .
EXPOSE 8080
CMD ["java", "Main"]
```

In this case, `javac Main.java` compiles my Java program in the first stage. Then I copy only `Main.class` into the second stage and run it using `java Main`.

### My understanding

The main thing I understood from this task is that **multi-stage builds let me separate the build part from the runtime part**. Instead of keeping everything from the build stage in the final image, I can copy only the files that are actually needed to run the application.
