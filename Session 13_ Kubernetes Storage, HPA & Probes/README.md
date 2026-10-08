# Session 13 
## Task 1: Kubernetes Volumes

## 1. Kubernetes Volumes - Overview

By default, the storage inside a container is temporary (ephemeral).

So if the container restarts or gets deleted, whatever data was stored inside its filesystem is lost.

Kubernetes Volumes are used when we want to keep data for longer or share data between containers in a Pod.

---

## 2. Main Volume Types & Storage Concepts

### A. `emptyDir`

- **What it is:** An empty directory that Kubernetes creates when the Pod is assigned to a node.
- **Lifecycle:** It stays as long as the Pod exists. If the Pod is deleted, the data inside `emptyDir` is also deleted.
- **Use Case:** Mainly used for temporary data, cache, or sharing data between containers inside the same Pod.

### B. `hostPath`

- **What it is:** It mounts a file or directory from the worker node's filesystem into the Pod.
- **Lifecycle:** The data stays on the node even if the Pod is deleted.
- **Use Case:** Useful when a Pod needs access to things like node-level logs or system files/containers.
- **Note:** Not recommended for multi-node production clusters because the data is tied to a particular node.

### C. `PersistentVolume` (PV)

- **What it is:** A storage resource available in the Kubernetes cluster. It can be backed by things like local disks or cloud storage.
- **Lifecycle:** Its lifecycle is independent of the Pod using it.

### D. `PersistentVolumeClaim` (PVC)

- **What it is:** Basically a request for storage made by a user or application.
- **How it works:** We can request things like `500Mi` of storage and specify an access mode such as `ReadWriteOnce`. Kubernetes then finds and binds it to a matching PV.

### E. `StorageClass`

- **What it is:** Defines the different types/classes of storage available in the cluster.
- **Role:** It is mainly used for dynamic provisioning, so Kubernetes can automatically create storage when a PVC asks for it.

### F. Dynamic Provisioning

- **What it is:** Kubernetes automatically creates a `PersistentVolume` when we create a `PersistentVolumeClaim`.
- **Why:** This means the cluster admin doesn't have to manually create and configure a PV every time storage is needed.

---

## 3. Practical Code Examples

### `emptyDir` Pod Specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-demo
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - mountPath: /data
      name: cache-vol
  volumes:
  - name: cache-vol
    emptyDir: {}
```
### `hostPath` Pod Specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-demo
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - mountPath: /node-logs
      name: host-log-vol
  volumes:
  - name: host-log-vol
    hostPath:
      path: /var/log
      type: Directory
```

---

### PersistentVolume (PV) Specification

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: student-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

---

### Dynamic PersistentVolumeClaim (PVC) Specification

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 500Mi
```
### Task 2: Horizontal Pod Autoscaler (HPA)

#### 1. Application Deployment & Metrics Server

- **Commands used:** `minikube start`, `kubectl apply -f deployment.yaml`, `kubectl apply -f service.yaml`, `minikube addons enable metrics-server`

- **What I did:** Started the Minikube cluster, deployed the application and service, and enabled `metrics-server` so that Kubernetes can track CPU and memory usage.
<img width="1191" height="313" alt="image" src="https://github.com/user-attachments/assets/bd855c67-69a1-44aa-bd18-c968ea224dc5" />
<img width="1191" height="424" alt="image" src="https://github.com/user-attachments/assets/cd7c0d6d-bd88-462c-a712-855fd3c6dfd3" />
<img width="846" height="129" alt="image" src="https://github.com/user-attachments/assets/2b57c9c3-ae25-440f-9cc5-a487c97f8e2f" />
<img width="1038" height="106" alt="image" src="https://github.com/user-attachments/assets/9e74959e-61f9-46ef-8573-84702ea1c05c" />

#### 2. HPA Setup & Load Generator

- **Commands used:** `kubectl apply -f hpa.yaml`, `kubectl run load-generator`, `kubectl get hpa -w`

- **What I did:** Created the HPA with a target CPU usage of 50%. Then I started a `load-generator` pod using BusyBox to create some load and simulate traffic.
<img width="989" height="808" alt="image" src="https://github.com/user-attachments/assets/a110af75-0e25-48ee-bede-4c402315cf06" />
<img width="859" height="60" alt="image" src="https://github.com/user-attachments/assets/c698e98f-a1c0-4bed-a6bb-2a75fdbc547d" />
<img width="969" height="206" alt="image" src="https://github.com/user-attachments/assets/3a5adabb-c536-4501-a252-13d3a84648b0" />

#### 3. Auto-Scaling & Load Generator Deletion

- **Commands used:** `kubectl get pods -w`, `kubectl delete pod load-generator`, `kubectl get hpa`

- **What I observed:** When the CPU usage went above the 50% target and reached 72%, HPA automatically increased the replicas from 1 to 2.
<img width="979" height="399" alt="image" src="https://github.com/user-attachments/assets/a0712c71-feb9-41ae-9f61-9d9eede1f78a" />
<img width="1202" height="116" alt="image" src="https://github.com/user-attachments/assets/93e7b2c7-f7a7-458c-a5db-3c7954608e48" />
<img width="1026" height="148" alt="image" src="https://github.com/user-attachments/assets/19ffe545-e386-4b13-874a-651cf6b191a5" />

  After deleting the `load-generator` pod, the load dropped and I checked the HPA again to verify that the system recovered and scaled back down.

## Task 3: Production-Ready Kubernetes Web App Mini Project

## 1. Project Overview

In this mini-project, I deployed a web app in a separate `production-webapp` namespace and combined a few important Kubernetes concepts:

- Persistent storage using PVC
- Automatic scaling using HPA
- Health checks using Startup, Readiness, and Liveness probes

The goal was to test how these things work together in a more production-like setup.

---

## 2. Execution & Results

### Step 1: Deploy Resources & Verify

Created the `production-webapp` namespace and deployed the application with:

- 500Mi PVC storage
- 2 initial application replicas
- Startup, Readiness, and Liveness probes
- ClusterIP service
- CPU-based HPA

<img width="1276" height="832" alt="image" src="https://github.com/user-attachments/assets/5c4a7664-416d-4ff0-8749-2c7e2a9a6fa6" />


---

### Step 2: Test Storage Persistence

Wrote some test data into `/data/student.txt` inside a running Pod.

Then I deleted the Pod and checked the newly created Pod. The data was still there, which confirmed that the data was being stored in the PersistentVolume instead of the Pod's temporary storage.

<img width="1643" height="151" alt="image" src="https://github.com/user-attachments/assets/3b896c10-5e9c-46c9-aaf1-f8f69a8d5a42" />


---

### Step 3: Test HPA Scaling

Used a `busybox` load generator to create some artificial HTTP traffic.

As the CPU usage went above the 50% target, HPA automatically increased the number of Pod replicas.

<img width="1272" height="172" alt="image" src="https://github.com/user-attachments/assets/7c86a0e7-8fe6-4b62-b7da-d9eb85bc62b4" />

---

### Step 4: Stop Load & Scale Down

Deleted the load generator after the scaling test.

Once the CPU usage came back down, HPA automatically reduced the number of replicas back to the minimum configured value.

<img width="1370" height="82" alt="image" src="https://github.com/user-attachments/assets/7e8ea0cf-d452-47e7-bdc4-c50f05678ad9" />


---

## 3. Useful Commands

```bash
kubectl get all -n production-webapp
kubectl get pvc -n production-webapp
kubectl get hpa -n production-webapp
kubectl describe pod <pod-name> -n production-webapp
```
