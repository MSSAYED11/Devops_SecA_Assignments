# 03. AWS S3 (Simple Storage Service)

## 1. What is S3?
Amazon S3 is an industry-leading object storage service offering 99.999999999% (11 9s) of data durability, high availability, and infinite scalability for files of any format.

## 2. Core S3 Concepts
- **Buckets:** Top-level containers for storing objects, with globally unique names across all AWS accounts.
- **Objects:** Fundamental entities stored in S3, consisting of data, a unique key (name), and metadata.
- **Storage Classes:**
  - `S3 Standard`: General-purpose storage for frequently accessed data.
  - `S3 Intelligent-Tiering`: Automatically moves data between tiers based on changing access patterns.
  - `S3 Standard-IA / One Zone-IA`: For infrequently accessed data requiring millisecond access.
  - `S3 Glacier Flexible / Deep Archive`: Low-cost archival storage with retrieval times from minutes to hours.
- **Versioning:** Keeps multiple versions of an object in the same bucket to protect against accidental deletion or overwrite.
- **Lifecycle Policies:** Automated rules that transition objects between storage classes or delete expired objects over time.
- **Encryption:** Server-Side Encryption using S3-managed keys (`SSE-S3`) or KMS keys (`SSE-KMS`).
- **Bucket Policies:** JSON-based resource policies attached to buckets to manage access permissions for users or accounts.

## 3. Common Use Cases
- Static website hosting and media asset distribution.
- Backup storage, disaster recovery, and log archiving.
- Centralized data lakes for analytics pipelines.
