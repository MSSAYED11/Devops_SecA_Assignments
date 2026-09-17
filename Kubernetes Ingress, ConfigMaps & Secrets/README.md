# Session 12: Ingress, ConfigMaps, and Secrets

In this session, I worked with a few important Kubernetes concepts like **ConfigMaps, Secrets, and Ingress**.

There are 4 tasks in total. The first three focus on individual concepts, and the last one puts everything together into a small full-stack application.

---

##  01: ConfigMap Management (`01-configmap`)

This task is about using **ConfigMaps** for storing normal configuration values and environment variables.

I also tried out some basic `kubectl` commands to create, check, extract values from, and delete a ConfigMap.

> **Screenshot:** Add the screenshot of the terminal execution here.
> It should show ConfigMap creation using `kubectl apply`, checking it with `kubectl describe`, getting a value using `jsonpath`, and deleting it.

<img width="786" height="1135" alt="image" src="https://github.com/user-attachments/assets/f798b68d-86fd-4e0d-98ba-8c48605754b3" />


---

## 02: Secret Injection (`02-secret`)

Here I worked with Kubernetes **Secrets** for storing sensitive information like database credentials.

The task includes converting the values to Base64, creating an Opaque Secret, checking the Secret, and then decoding the stored values using `jsonpath`.

> **Screenshot:** Add the screenshot of the terminal execution here.
> It should show the Base64 encoding, Secret creation using `kubectl apply`, checking the Secret with `kubectl get`, and decoding the values using `jsonpath`.

![Task 02 Terminal Execution](./02-secret/screenshot.png)

---

## 03: Ingress Routing & TLS (`03-ingress`)

This task focuses on **Ingress** and how it can be used for routing HTTP requests to different services.

I also generated a self-signed TLS certificate using `openssl`, created a TLS Secret, and connected it with the Ingress configuration.

> **Screenshot:** Add the screenshot of the terminal execution here.
> It should show the Ingress setup, TLS certificate generation, TLS Secret creation, and testing the Ingress using `curl`.

![Task 03 Terminal Execution](./03-ingress/screenshot.png)

---

## 04: Full Demo Application (`04-full-demo`)

This is where everything comes together.

I set up a small full-stack application on Kubernetes with:

* Nginx frontend
* Python backend API
* ConfigMap
* Secret
* Ingress routing
* WSL2 port-forwarding

The task also includes checking the rollout status, enabling the Ingress addon, setting up port forwarding in the background, and testing the frontend and API using `curl`.

I also checked the environment variables inside the running pod and ran the provided script to verify that everything was working properly.

> **Screenshot:** Add the screenshot of the complete terminal execution here.
> It should show the deployment steps, Ingress addon setup, rollout status, port-forwarding, successful responses from `/` and `/api/`, checking the pod environment, and the script execution.

![Task 04 Terminal Execution](./04-full-demo/screenshot.png)

---

## What I covered

By the end of this session, I got some hands-on practice with:

* ConfigMaps
* Kubernetes Secrets
* Base64 encoding/decoding
* Ingress
* TLS certificates
* Nginx
* Python backend APIs
* Port forwarding with WSL2
* Connecting multiple Kubernetes resources together

The last task basically combines all of these into one working setup.
