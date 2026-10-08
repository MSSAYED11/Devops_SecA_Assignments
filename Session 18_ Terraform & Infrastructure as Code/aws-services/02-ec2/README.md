# 02. AWS EC2 (Elastic Compute Cloud)

## 1. What is EC2?
Amazon EC2 provides scalable, on-demand virtual computing servers (instances) in the cloud, allowing organizations to run applications with configurable CPU, memory, storage, and networking.

## 2. Core Concepts
- **AMI (Amazon Machine Image):** Pre-configured template containing the OS, application server, and applications required to launch an instance.
- **Instance Types:** Families optimized for different compute needs (General Purpose `t3/m5`, Compute Optimized `c5`, Memory Optimized `r5`, Storage Optimized `i3`).
- **Key Pairs:** Asymmetric cryptographic keys (public key stored in AWS, private key held by user) used to securely SSH into Linux instances or decrypt Windows administrator passwords.
- **Security Groups:** Virtual stateful firewalls controlling inbound and outbound traffic at the instance level.
- **EBS (Elastic Block Store):** High-performance block storage volumes attached to EC2 instances for persistent data.
- **Public vs Private IP:** Public IPs are reachable from the internet, while private IPs are only accessible within the VPC.

## 3. Instance Lifecycle
`Pending` → `Running` → `Stopping` → `Stopped` → `Shutting-Down` → `Terminated`

## 4. Common Use Cases
- Hosting containerized web servers and backend APIs.
- Running background data processing jobs and CI/CD self-hosted runners.
