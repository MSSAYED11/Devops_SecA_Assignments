
# Docker Networking & Volumes Homework

**Name:** M S Sayed  
**Enrollment Number:** 24BCS10396  

---

## Task 1: Docker Container Networking
**Objective:** Create 3 containers (Frontend, Backend, Database) across 3 networks and bridge the backend to the frontend.

**Verification (Ping from Backend to Frontend):**
<img width="681" height="171" alt="image" src="https://github.com/user-attachments/assets/783e274f-3781-4151-94a0-03f5435e64d7" />



---

## Task 2: Host Network
**Objective:** Run an Apache2 container using the host's network stack.

**Verification:**
<!-- ADD YOUR TASK 2 APACHE/DOCKER PS SCREENSHOT HERE -->

---

## Task 3: Bind Mount
**Objective:** Bind mount a local folder containing an HTML file to an Nginx container and verify live updates.

**Verification (Initial & Modified Content):**
<!-- ADD YOUR TASK 3 CURL SCREENSHOTS HERE -->

---

## Task 4: Overlay Network (Research)

**1. What is an Overlay Network?**
A Docker overlay network is a distributed network built on top of an existing host-specific network. It allows containers running on different physical Docker daemon hosts (like a Docker Swarm cluster) to communicate securely as if they were on the same local machine.

**2. Use Cases:**
* **High Availability & Scaling:** Deploying microservices across multiple servers so if one server goes down, the application remains online.
* **Swarm Services:** Connecting manager and worker nodes in a Docker Swarm.
* **Secure Multi-Host Communication:** Encrypting container traffic (IPSec) as it travels across the public internet between different data centers.

**3. How it Works Across Multiple Hosts:**
Overlay networks utilize a VXLAN (Virtual eXtensible Local Area Network) tunnel. When a container on Host A sends a packet to a container on Host B, Docker on Host A encapsulates the container's packet inside a standard host-level UDP packet. It travels across the physical network to Host B, where Docker decapsulates it and delivers it directly to the target container.
