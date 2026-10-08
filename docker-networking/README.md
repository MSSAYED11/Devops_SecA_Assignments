# Docker Networking & Volumes Homework

**Name:** M S Sayed
**Enrollment Number:** 24BCS10396

---

## Task 1: Docker Container Networking

**Objective:** Create 3 containers (Frontend, Backend, Database) across 3 networks and bridge the backend to the frontend.

### My understanding

For this task, I created three containers for the frontend, backend and database. I connected them using different Docker networks and then connected the backend to the frontend network as required.

I then checked the connection by trying to ping the frontend container from the backend container. This helped me verify that the containers connected through the network could communicate with each other.

### Verification

<img width="681" height="171" alt="image" src="https://github.com/user-attachments/assets/783e274f-3781-4151-94a0-03f5435e64d7" />

---

## Task 2: Host Network

**Objective:** Run an Apache2 container using the host's network stack.

### My understanding

In this task, I ran an Apache2 container using the host network.

With the host network mode, the container uses the network stack of the host machine instead of getting a separate Docker network interface. I also checked the running container to make sure it was working correctly.

### Verification

<img width="1442" height="45" alt="image" src="https://github.com/user-attachments/assets/dc71e4d8-9016-41b9-b11f-522d4ce04754" />

---

## Task 3: Bind Mount

**Objective:** Bind mount a local folder containing an HTML file to an Nginx container and verify live updates.

### My understanding

For this task, I used a local folder containing an HTML file and mounted it inside an Nginx container.

The useful part of a bind mount is that the file on my local machine is directly connected to the file inside the container. So when I changed the HTML file locally, the changes could be seen from the Nginx container without having to build a new Docker image.

I checked the page first with the original content and then modified the HTML file and checked it again to confirm that the changes were reflected.

### Verification

<img width="736" height="87" alt="image" src="https://github.com/user-attachments/assets/72233593-be85-431c-a410-afb7faf019f0" />



---

## Task 4: Overlay Network (Research)

### 1. What is an Overlay Network?

An overlay network is basically a Docker network that works on top of the existing network of the host machines.

It is useful when containers are running on different Docker hosts. For example, in a Docker Swarm setup, containers on different machines can communicate with each other as if they were part of the same network.

### 2. Use Cases

Some of the use cases I found are:

* **High Availability & Scaling:** I can run microservices across multiple servers. If one server goes down, the application can still continue running on the other servers.

* **Swarm Services:** Overlay networks are used to connect services running across Docker Swarm manager and worker nodes.

* **Secure Multi-Host Communication:** Container traffic can be encrypted while it is travelling between different hosts or data centers.

### 3. How it Works Across Multiple Hosts

Overlay networks use a technology called **VXLAN (Virtual eXtensible Local Area Network)** to create the connection between different hosts.

For example, if a container on Host A wants to send a packet to a container on Host B, Docker first puts the container's packet inside another network packet. This packet then travels through the normal network between the two hosts.

When it reaches Host B, Docker removes the outer packet and sends the original packet to the correct container.

So, in simple terms, the overlay network creates a virtual network between different Docker hosts, which allows the containers on those hosts to communicate with each other.


