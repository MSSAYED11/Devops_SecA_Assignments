# Kubernetes Troubleshooting & Diagnostic Exercises

This directory contains runtime fault drills for diagnosing common Kubernetes deployment failures, matching the evaluation requirements in **GRADING.md**.

---

## Exercise 1: Container Image Pull Failure (`broken-image.yaml`)

### Symptoms
When applying [`broken-image.yaml`](broken-image.yaml):
```bash
kubectl apply -f troubleshooting/broken-image.yaml
kubectl get pods -n restaurant
```
The pod enters an error state:
```text
NAME                                       READY   STATUS             RESTARTS   AGE
restaurant-broken-image-54d9c79d9c-abcde   0/1     ImagePullBackOff   0          45s
```

### Diagnosis
Inspect the pod events:
```bash
kubectl describe pod -n restaurant -l app=broken-image
```
**Under Events**:
```text
Failed to pull image "ghcr.io/example/restaurant-backend:does-not-exist": rpc error: code = NotFound desc = failed to pull and unpack image ... manifest unknown
Warning  Failed     Failed to pull image
Warning  Failed     Error: ImagePullBackOff
```

### Root Cause & Resolution
1. **Cause**: The container image repository or tag `does-not-exist` does not exist or requires authentication secrets (`imagePullSecrets`).
2. **Resolution**: Update the deployment manifest to reference a verified image from GitHub Container Registry (e.g. `ghcr.io/mssayed11/restaurant-backend:<valid-sha>`) and ensure the namespace has the required registry pull secret configured.

---

## Exercise 2: Mismatched Service Selector (`broken-service.yaml`)

### Symptoms
When applying [`broken-service.yaml`](broken-service.yaml):
```bash
kubectl apply -f troubleshooting/broken-service.yaml
kubectl get svc -n restaurant broken-service
```
Traffic routed to `broken-service` fails with connection timeouts or `HTTP 502/503 Bad Gateway`.

### Diagnosis
Inspect the service endpoints:
```bash
kubectl get endpoints -n restaurant broken-service
```
**Output**:
```text
NAME             ENDPOINTS   AGE
broken-service   <none>      20s
```

Inspect the service configuration:
```bash
kubectl describe svc broken-service -n restaurant
```
**Selector**: `app=label-that-does-not-exist`

### Root Cause & Resolution
1. **Cause**: The Service selector `app: label-that-does-not-exist` does not match any running Pod labels in the `restaurant` namespace. Because no pods match the selector, Kubernetes registers zero Endpoints (`<none>`).
2. **Resolution**: Change the Service selector in [`broken-service.yaml`](broken-service.yaml) to match the actual workload label:
   ```yaml
   spec:
     selector:
       app.kubernetes.io/name: backend
     ports:
       - port: 8000
         targetPort: 8000
   ```
   Re-running `kubectl get endpoints -n restaurant broken-service` will then show the active Pod IP addresses and traffic routes successfully.
