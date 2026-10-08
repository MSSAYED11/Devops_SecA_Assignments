# 05. AWS Database Services (DynamoDB & RDS)

## 1. Amazon DynamoDB (NoSQL Key-Value & Document Database)
- **What is DynamoDB:** Fully managed, serverless NoSQL database designed for single-digit millisecond latency at any scale.
- **Key Concepts:**
  - **Tables:** Collection of items (data records).
  - **Items:** Group of attributes (similar to rows, but schemaless).
  - **Attributes:** Fundamental data elements (similar to columns/fields).
  - **Primary Keys:**
    - *Partition Key (HASH):* Determines the internal physical storage partition.
    - *Sort Key (RANGE):* Allows storing multiple items with the same partition key sorted in order.
- **Use Cases:** Real-time user sessions, gaming leaderboards, shopping carts, mobile application backends.

---

## 2. Amazon RDS (Relational Database Service)
- **What is RDS:** Managed relational database service that automates provisioning, patching, backup, recovery, and scaling.
- **Supported Engines:** PostgreSQL, MySQL, MariaDB, Oracle, Microsoft SQL Server, Amazon Aurora.
- **High Availability & Scaling:**
  - **Multi-AZ Deployment:** Synchronous standby replica in a second Availability Zone providing automatic failover during outages.
  - **Read Replicas:** Asynchronous replicas offloading read-heavy workloads from the primary database instance.
  - **Backups:** Automated daily snapshots and point-in-time recovery (PITR) transaction logs.
- **Use Cases:** E-commerce transactions, financial ledgers, enterprise ERP/CRM systems requiring ACID transactions.
