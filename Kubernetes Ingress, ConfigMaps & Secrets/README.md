# Session 12: Ingress, ConfigMaps, and Secrets

In this session, I worked with a few important Kubernetes concepts like **ConfigMaps, Secrets, and Ingress**.

There are 4 tasks in total. The first three focus on individual concepts, and the last one puts everything together into a small full-stack application.

---

##  01: ConfigMap Management (`01-configmap`)

This task is about using **ConfigMaps** for storing normal configuration values and environment variables.

I also tried out some basic `kubectl` commands to create, check, extract values from, and delete a ConfigMap.

> **Screenshot:** Add the screenshot of the terminal execution here.
> It should show ConfigMap creation using `kubectl apply`, checking it with `kubectl describe`, getting a value using `jsonpath`, and deleting it.

<img width="1116" height="1230" alt="image" src="https://github.com/user-attachments/assets/3f062854-5ccc-448c-bff3-e3594810201b" />


---

## 02: Secret Injection (`02-secret`)

Here I worked with Kubernetes **Secrets** for storing sensitive information like database credentials.

The task includes converting the values to Base64, creating an Opaque Secret, checking the Secret, and then decoding the stored values using `jsonpath`.

> **Screenshot:** Add the screenshot of the terminal execution here.
> It should show the Base64 encoding, Secret creation using `kubectl apply`, checking the Secret with `kubectl get`, and decoding the values using `jsonpath`.

<img width="1318" height="1124" alt="image" src="https://github.com/user-attachments/assets/bc2cd6d1-6750-4021-87c4-5a18568ee66e" />



---

## 03: Ingress Routing & TLS (`03-ingress`)

This task focuses on **Ingress** and how it can be used for routing HTTP requests to different services.

I also generated a self-signed TLS certificate using `openssl`, created a TLS Secret, and connected it with the Ingress configuration.

> **Screenshot:** Add the screenshot of the terminal execution here.
> It should show the Ingress setup, TLS certificate generation, TLS Secret creation, and testing the Ingress using `curl`.

<img width="1287" height="851" alt="image" src="https://github.com/user-attachments/assets/39f2d2d8-d4e3-4544-a13e-7c5b9a3aff6f" />
<img width="1325" height="1161" alt="image" src="https://github.com/user-attachments/assets/53def339-2cad-480f-8705-2abed29ae216" />
<img width="1289" height="1006" alt="image" src="https://github.com/user-attachments/assets/563720a5-5928-4060-8452-615cd07b52a2" />
<img width="1104" height="538" alt="image" src="https://github.com/user-attachments/assets/2c230b46-1892-42fd-aa44-73caee83c98d" />




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

<img width="1085" height="812" alt="image" src="https://github.com/user-attachments/assets/024b0707-2e9e-4b5d-baa3-fb10e77fe29d" />
<img width="1137" height="994" alt="image" src="https://github.com/user-attachments/assets/ed59a514-80a7-44ff-83ec-294b15493313" />
<img width="1135" height="1240" alt="image" src="https://github.com/user-attachments/assets/59b17d82-a9ee-4691-985e-c93a9b428feb" />
<img width="1113" height="997" alt="image" src="https://github.com/user-attachments/assets/6005b36b-13f1-4353-a3df-01c46c0c25f3" />
<img width="1105" height="1105" alt="image" src="https://github.com/user-attachments/assets/c55c2f05-2018-4bd3-99a6-42b2b1e532aa" />


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
