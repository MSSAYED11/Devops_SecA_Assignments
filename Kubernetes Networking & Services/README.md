# Kubernetes Services: Practice & Execution Log

This is my hands-on practice with the different types of **Kubernetes Services**.

I worked with ClusterIP, NodePort, LoadBalancer, ExternalName, and Headless Services and tested how each one behaves.

---

## 1. ClusterIP — Internal Communication

**Goal:** Make the pods accessible from inside the Kubernetes cluster.

For this, I deployed Nginx pods and created a `ClusterIP` service for them.

I then used a temporary `curl-client` pod to test the connection using the service name, service IP, and the full DNS name (FQDN).

### Proof of Execution

<img width="1343" height="487" alt="image" src="https://github.com/user-attachments/assets/7f26fb99-641a-48e6-b66b-a9d9c0bcee52" />
<img width="1580" height="1108" alt="image" src="https://github.com/user-attachments/assets/713a2132-f026-46b8-b424-408b1d12fb29" />
<img width="1795" height="536" alt="image" src="https://github.com/user-attachments/assets/81ff5b0b-80ce-4821-8f5c-3ad7c5aa5665" />


---

## 2. NodePort — Access Through the Node

**Goal:** Access the application through a fixed port on the Kubernetes node.

I created a `NodePort` service which maps port `80` of the service to port `30080` on the node.

I then tested the service by using `kubectl port-forward` and checking if the application was reachable.

### Proof of Execution

*(Insert Screenshot: `kubectl get svc web-service-nodeport` showing `80:30080/TCP` and the active `port-forward` connection)*

---

## 3. LoadBalancer — External Access

**Goal:** Expose the application using a `LoadBalancer` service.

I created a `LoadBalancer` service and checked how Kubernetes handles external access.

For the local setup, I used `localhost` to simulate the external access and verified that the web server returned a successful response.

### Proof of Execution

*(Insert Screenshot: LoadBalancer service showing the `EXTERNAL-IP` and successful `curl -i http://localhost` with an HTTP 200 response)*

---

## 4. ExternalName — Connecting to External Services

**Goal:** Use a Kubernetes service name to point to something outside the cluster.

For this task, I created an `ExternalName` service and pointed it to an external DNS name.

I then used a test pod to check the DNS resolution with `nslookup` and also tested the connection using `curl`.

This is useful when we don't want the application to directly depend on a hardcoded external URL.

### Proof of Execution

*(Insert Screenshot: `nslookup` and `curl` commands showing the DNS resolution and connection to the external target)*

---

## 5. Headless Service — Direct Pod Discovery

**Goal:** Get the individual pod addresses instead of using a single service IP.

For this one, I deployed a StatefulSet and connected it to a Headless Service using:

```yaml
clusterIP: None
```

Because there is no virtual ClusterIP, DNS queries for the service return the IP addresses of the individual pods.

I verified this using CoreDNS and also tested connecting directly to a specific pod, such as `web-stateful-0`.

### Proof of Execution

*(Insert Screenshot: `nslookup` showing the individual Pod IPs and a successful `curl` request to a specific pod such as `web-stateful-0`)*

---

## What I Practiced

Through these tasks, I got to practice the main Kubernetes Service types:

* **ClusterIP** — communication inside the cluster
* **NodePort** — access through a node port
* **LoadBalancer** — external access through a load balancer
* **ExternalName** — connecting a Kubernetes service to an external DNS name
* **Headless Service** — discovering individual pods directly

The main thing I wanted to understand here was how Kubernetes exposes applications differently depending on the type of Service we use.
