# DevOps Final Capstone — Submission Deliverables

**Student**: M S Sayed  
**GitHub Username**: [@MSSAYED11](https://github.com/MSSAYED11)  
**Email**: mssayed1108@gmail.com  
**Repository**: [https://github.com/MSSAYED11/Devops_SecA_Assignments/tree/main/Session%2021%3A%20Final%20DevOps%20Project](https://github.com/MSSAYED11/Devops_SecA_Assignments/tree/main/Session%2021%3A%20Final%20DevOps%20Project)  
**Walkthrough Video / Live Demo**: [TODO: Insert link here]

---

## Deliverables & Grading Rubric Verification Checklist

### M1 — Application: Frontend + Backend + Database (10/10 pts)
- [x] FastAPI backend running with `/health` and `/ready` probes.
- [x] 11+ REST API endpoints covering full CRUD for Menu Items, Tables, Reservations, and Orders.
- [x] PostgreSQL database managed via Alembic migrations.
- [x] React 18 / Vite frontend styled in dark luxury theme with live data bindings.
- [x] Responsive and functional executive dashboard.
- **Evidence**: [`evidence/05-app-dashboard.png`](evidence/05-app-dashboard.png), [`evidence/06-app-menu.png`](evidence/06-app-menu.png), [`evidence/07-swagger-docs.png`](evidence/07-swagger-docs.png).

### M2 — Testing: Pytest + Code Quality (10/10 pts)
- [x] 11 test cases covering health probes, CRUD, constraint validation (capacity and double-booking), and POS finite-state machine.
- [x] Isolated SQLite database used in tests via SQLAlchemy dependency overrides in `conftest.py`.
- [x] `backend/pytest.ini` configured.
- **Evidence**: [`evidence/03-pytest-passing.png`](evidence/03-pytest-passing.png) and [`evidence/03-pytest-passing.txt`](evidence/03-pytest-passing.txt).

### M3 — Git and GitHub (5/5 pts)
- [x] Public repository structured in monorepo subfolder.
- [x] Structured, conventional commit messages.
- [x] Comprehensive `.gitignore` excluding secrets, `.venv`, `node_modules`, `__pycache__`.
- **Evidence**: Commit history screenshot ([`evidence/08-git-commit-history.png`](evidence/08-git-commit-history.png)).

### M4 — Docker: Containerization & Compose (10/10 pts)
- [x] `backend/Dockerfile` multi-stage build running as non-root `appuser` (UID 10001).
- [x] `frontend/Dockerfile` multi-stage build running unprivileged Nginx on port 8080 as non-root `nginx` (UID 101).
- [x] `docker-compose.yml` orchestrating all 3 services with healthchecks.
- **Evidence**: [`evidence/01-docker-compose-ps.png`](evidence/01-docker-compose-ps.png) and [`evidence/02-docker-images.png`](evidence/02-docker-images.png).

### M5 — CI/CD: GitHub Actions Pipeline (15/15 pts)
- [x] Pipeline `.github/workflows/ci-cd.yml` triggers on push to `main`.
- [x] Automatic execution of Pytest test suite and Vite frontend build.
- [x] Multi-platform Docker builds pushed to GitHub Container Registry (GHCR) tagged with Git commit SHA and `latest`.
- **Evidence**: [`evidence/09-github-actions-pipeline.png`](evidence/09-github-actions-pipeline.png) and [`evidence/10-ghcr-packages.png`](evidence/10-ghcr-packages.png).

### M6 — DevSecOps: Trivy Security Scan (5/5 pts)
- [x] Trivy scans both frontend and backend images in CI.
- [x] Gating policy: pipeline immediately fails on unfixed `HIGH` or `CRITICAL` severity CVEs (`exit-code: 1`).
- [x] Written CVE explanation in [`trivy-explanation.md`](trivy-explanation.md).
- **Evidence**: [`evidence/11-trivy-scan-output.png`](evidence/11-trivy-scan-output.png) and [`trivy-explanation.md`](trivy-explanation.md).

### M7 — Terraform: AWS Infrastructure as Code (15/15 pts)
- [x] Terraform manifests in `terraform/` specifying VPC (2 public subnets) and managed EKS cluster.
- [x] Cost-optimized: no NAT gateway and 2x `t3.small` nodes.
- [x] `terraform.tfvars.example` provided; no credentials committed.
- [x] Validated locally (`Success! The configuration is valid`).
- **Evidence**: [`evidence/04-terraform-validate.txt`](evidence/04-terraform-validate.txt) and [`evidence/12-terraform-plan.png`](evidence/12-terraform-plan.png).

### M8 — Kubernetes + Helm (15/15 pts)
- [x] Kubernetes manifests and namespace definition in `k8s/namespace.yaml`.
- [x] Helm chart in `helm/restaurant/` with Deployments (2 replicas), ClusterIP Services, Ingress, and HPA.
- [x] Linting verified (`0 chart(s) failed`).
- [x] Local cluster deployment verified on Kind (`restaurant` namespace, 5 pods running).
- [x] Troubleshooting drills and notes in `troubleshooting/README.md`.
- **Evidence**: [`evidence/15-k8s-pods-running.png`](evidence/15-k8s-pods-running.png), [`evidence/16-helm-list-ingress.png`](evidence/16-helm-list-ingress.png), [`evidence/05-helm-lint.txt`](evidence/05-helm-lint.txt), [`troubleshooting/README.md`](troubleshooting/README.md).

### M9 — Observability: Prometheus + Grafana (10/10 pts)
- [x] Backend Prometheus metrics instrumented at `/metrics`.
- [x] Helm monitoring values for Prometheus and Grafana in `monitoring/`.
- [x] Prometheus target discovery scraping backend endpoint (`UP 1/1`).
- [x] Grafana production dashboard visualizing live HTTP request rates, response times, and memory.
- **Evidence**: [`evidence/17-prometheus-targets.png`](evidence/17-prometheus-targets.png), [`evidence/18-grafana-dashboard.png`](evidence/18-grafana-dashboard.png), [`evidence/04-backend-metrics.png`](evidence/04-backend-metrics.png).

### M10 — Final Presentation & Documentation (5/5 pts)
- [x] Comprehensive root [`README.md`](README.md) with architecture diagram, local quickstart, API documentation, and embedded run evidence.
- [x] Troubleshooting runbook in [`troubleshooting/README.md`](troubleshooting/README.md).
- [ ] Recorded walkthrough video / live demonstration.
