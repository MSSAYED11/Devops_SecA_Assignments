# Trivy Security Scanning in CI/CD

## Security Gating Policy & Flags
In the GitHub Actions CI/CD pipeline ([`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)), Trivy automatically scans both container images directly after building and before any image push occurs:

```bash
trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 --format table <image-tag>
```

- **`--severity HIGH,CRITICAL`**: Focuses scanning on high and critical impact vulnerabilities.
- **`--ignore-unfixed`**: Suppresses CVEs where the upstream vendor has not yet released a patch, focusing strictly on actionable remediations.
- **`--exit-code 1`**: Enforces a strict blocking gate. If any fixable HIGH or CRITICAL finding is detected, Trivy exits with code 1, which immediately fails the workflow step and prevents execution of the subsequent `docker push` step.

## Container Architecture
- **Frontend (`frontend/Dockerfile`)**: **Only the frontend Dockerfile is multi-stage**. It uses a Node.js 20 (LTS) builder stage to compile the React/Vite assets, followed by an unprivileged Nginx runtime (`nginxinc/nginx-unprivileged:alpine`) on port 8080 running as non-root user `nginx` (UID 101).
- **Backend (`backend/Dockerfile`)**: The backend is an optimized **single-stage** Debian slim container (`python:3.12-slim`), running as unprivileged non-root user `appuser` (UID 10001).

## Scan Evidence
- **Evidence Reference**: Row 11 in README.md — "Trivy scan output from the CI job log" (`evidence/11-trivy-scan-output.png` — TODO).
- **Zero Ignore Rules**: No CVE ignore rules (`.trivyignore`) are applied.
