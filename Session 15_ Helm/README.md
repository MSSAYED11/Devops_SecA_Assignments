# Session 15: Helm

## Task 1: Essential Helm Commands

### 1. Create a Helm Chart (`helm create`)
Used `helm create` to generate the default directory structure and template files for a new chart.

```powershell
helm create mychart
```
![Helm Create](screenshots/task1-1-helm-create.png)

---

### 2. Install a Chart Release (`helm install`)
Installed the chart as a named release (`demo-release`) into the local Kubernetes cluster.

```powershell
helm install demo-release ./01-helm-commands/mychart
```
![Helm Install](screenshots/task1-2-helm-install.png)

---

### 3. List Releases (`helm list`)
Checked the list of deployed Helm releases and verified the revision and status.

```powershell
helm list
```
![Helm List](screenshots/task1-3-helm-list.png)

---

### 4. Check Release Status (`helm status`)
Viewed the detailed status of the deployed release, including namespace, status, revision, and notes.

```powershell
helm status demo-release
```
![Helm Status](screenshots/task1-4-helm-status.png)

---

### 5. Inspect Values and Manifests (`helm get`)
Retrieved the user-supplied values and rendered Kubernetes manifests for the release.

```powershell
helm get values demo-release
```
![Helm Get Values](screenshots/task1-5-helm-get-values.png)

```powershell
helm get manifest demo-release | Select-Object -First 25
```
![Helm Get Manifest](screenshots/task1-6-helm-get-manifest.png)

---

### 6. Upgrade a Release (`helm upgrade`)
Upgraded the release by overriding values at runtime using the `--set` flag.

```powershell
helm upgrade demo-release ./01-helm-commands/mychart --set replicaCount=2
```
![Helm Upgrade](screenshots/task1-7-helm-upgrade.png)

---

### 7. View Release History (`helm history`)
Inspected the revision history of the release to see past revisions, status, and descriptions.

```powershell
helm history demo-release
```
![Helm History](screenshots/task1-8-helm-history.png)

---

### 8. Rollback a Release (`helm rollback`)
Rolled back the release to the previous revision (`Revision 1`).

```powershell
helm rollback demo-release 1
```
![Helm Rollback](screenshots/task1-9-helm-rollback.png)

---

### 9. Uninstall a Release (`helm uninstall`)
Uninstalled the release and cleaned up all associated Kubernetes resources.

```powershell
helm uninstall demo-release
```
![Helm Uninstall](screenshots/task1-10-helm-uninstall.png)

---

### 10. Repository Management & Search (`helm repo` & `helm search`)
Added the Bitnami chart repository, listed installed repositories, and searched for available charts.

```powershell
helm repo add bitnami https://charts.bitnami.com/bitnami
```
![Helm Repo Add](screenshots/task1-11-helm-repo-add.png)

```powershell
helm repo list
```
![Helm Repo List](screenshots/task1-12-helm-repo-list.png)

```powershell
helm search repo bitnami/nginx | Select-Object -First 10
```
![Helm Search Repo](screenshots/task1-13-helm-search-repo.png)


---

# Task 2: Helm Rollback Workflow

In this task, I performed a complete sequential lifecycle workflow: installing Revision 1, upgrading to Revision 2, upgrading to Revision 3, and rolling back to Revision 2.

### Step 1: Install Revision 1 (1 Replica)
Deployed the initial release configured with 1 pod replica.

```powershell
helm install rollback-demo ./02-helm-rollback/app-chart --set replicaCount=1
```
![Install Revision 1](screenshots/task2-1-install-rev1.png)

```powershell
kubectl get pods
```
![Verify Revision 1](screenshots/task2-2-verify-rev1.png)

---

### Step 2: Upgrade to Revision 2 (2 Replicas)
Scaled the deployment to 2 replicas via `helm upgrade`.

```powershell
helm upgrade rollback-demo ./02-helm-rollback/app-chart --set replicaCount=2
```
![Upgrade Revision 2](screenshots/task2-3-upgrade-rev2.png)

```powershell
kubectl get pods
```
![Verify Revision 2](screenshots/task2-4-verify-rev2.png)

---

### Step 3: Upgrade to Revision 3 (3 Replicas)
Scaled the deployment to 3 replicas via another `helm upgrade`.

```powershell
helm upgrade rollback-demo ./02-helm-rollback/app-chart --set replicaCount=3
```
![Upgrade Revision 3](screenshots/task2-5-upgrade-rev3.png)

```powershell
kubectl get pods
```
![Verify Revision 3](screenshots/task2-6-verify-rev3.png)

---

### Step 4: Check History Before Rollback
Checked the 3 active revisions recorded in Helm history.

```powershell
helm history rollback-demo
```
![History Before Rollback](screenshots/task2-7-history-before-rollback.png)

---

### Step 5: Rollback to Revision 2 & Verify
Rolled back the release to Revision 2 (2 replicas) and verified the running pods and history.

```powershell
helm rollback rollback-demo 2
```
![Rollback to Revision 2](screenshots/task2-8-rollback-to-rev2.png)

```powershell
kubectl get pods
```
![Verify Rollback Pods](screenshots/task2-9-verify-rollback-pods.png)

```powershell
helm history rollback-demo
```
![History After Rollback](screenshots/task2-10-history-after-rollback.png)


---

# Task 3: Helm Mini Project (Notes App Deployment)

## 1. Project Overview & Chart Structure

Created a custom Helm chart for a Notes Web Application with configurable environments (development vs production):

```text
notes-chart/
├── Chart.yaml
├── values.yaml
├── values-prod.yaml
└── templates/
    ├── configmap.yaml
    ├── deployment.yaml
    └── service.yaml
```

---

## 2. Chart Validation & Local Template Rendering

### Lint Chart
Validated chart syntax and best practices.

```powershell
helm lint ./mini-project/notes-chart
```
![Helm Lint](screenshots/task3-1-helm-lint.png)

### Render Templates Locally
Tested template variable substitution locally before installing.

```powershell
helm template notes-dev ./mini-project/notes-chart | Select-Object -First 30
```
![Helm Template](screenshots/task3-2-helm-template.png)

---

## 3. Development Deployment

Installed the application using development defaults (`values.yaml` - 1 replica, `nginx:1.24`).

```powershell
helm install notes-dev ./mini-project/notes-chart
```
![Install Development](screenshots/task3-3-install-dev.png)

```powershell
kubectl get pods,svc,configmaps -l app=notes-dev
```
![Verify Development](screenshots/task3-4-verify-dev.png)

---

## 4. Production Upgrade

Upgraded the release using production values (`values-prod.yaml` - 3 replicas, `nginx:1.25`).

```powershell
helm upgrade notes-dev ./mini-project/notes-chart -f ./mini-project/notes-chart/values-prod.yaml
```
![Upgrade Production](screenshots/task3-5-upgrade-prod.png)

```powershell
kubectl get pods -l app=notes-dev
```
![Verify Production Pods](screenshots/task3-6-verify-prod-pods.png)

```powershell
helm history notes-dev
```
![History Production](screenshots/task3-7-history-prod.png)

---

## 5. Simulating a Failed Upgrade & Rollback

### Step 1: Simulate Bad Upgrade
Upgraded the release with an invalid non-existent image tag.

```powershell
helm upgrade notes-dev ./mini-project/notes-chart --set image.tag=broken-tag-does-not-exist
```
![Upgrade Broken](screenshots/task3-8-upgrade-broken.png)

```powershell
kubectl get pods -l app=notes-dev
```
![Verify Broken Pods](screenshots/task3-9-verify-broken-pods.png)

### Step 2: Rollback to Healthy Production Revision (Revision 2)
Recovered the release by rolling back to Revision 2.

```powershell
helm rollback notes-dev 2
```
![Rollback Production](screenshots/task3-10-rollback-prod.png)

```powershell
kubectl get pods -l app=notes-dev
```
![Verify Restored Production](screenshots/task3-11-verify-restored-prod.png)

```powershell
helm history notes-dev
```
![Final History](screenshots/task3-12-final-history.png)
