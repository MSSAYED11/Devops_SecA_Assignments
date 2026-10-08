# Docker Fundamentals: Hello World Applications

For this assignment, I created six basic **Hello World** web applications and containerized them using Docker. This was done as part of my DevOps coursework.

---

## Directory Structure & Applications

I have created the following applications:

* **`nginx-app/`** – A simple static HTML page served using the Nginx web server. It runs on port `80`.

* **`apache-app/`** – A static HTML page served using the Apache `httpd` web server. It also runs on port `80`.

* **`nodejs-app/`** – An Express.js server which returns **"Hello World from Node.js Docker!"**. It runs on port `3000`.

* **`python-app/`** – A small Flask application which returns **"Hello World from Python Docker!"**. It runs on port `5000`.

* **`java-app/`** – A Java application using the built-in Java HTTP server. The Java code is compiled and then run inside the container on port `8080`.

* **`react-app/`** – A simple React single-page application which is served using Nginx. It runs on port `80`.

---

## How I Build and Run the Applications

To run any of the applications, I first go inside that application's directory.

Then I build the Docker image using:

```bash
docker build -t <app-name> .
```

After the image is created, I run the container using:

```bash
docker run -d -p <port>:<port> --name <container-name> <app-name>
```

After running the container, I can open this in my browser:

```text
http://localhost:<port>
```

Everything is working correctly, the **Hello World** output is displayed in the browser.
<img width="1130" height="582" alt="image" src="https://github.com/user-attachments/assets/f3f852b2-a475-4034-9138-36011072992b" />

---
