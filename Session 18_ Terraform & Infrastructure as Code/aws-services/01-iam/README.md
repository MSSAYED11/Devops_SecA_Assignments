# 01. AWS IAM (Identity & Access Management)

## 1. What is IAM?
AWS Identity and Access Management (IAM) is a web service that helps securely control access to AWS resources. It provides centralized management of users, security credentials, and access permissions.

## 2. Core IAM Components
- **IAM Users:** Identity assigned to a specific person or service requiring long-term access to AWS.
- **IAM Groups:** Collections of IAM users used to attach permissions to multiple users at once.
- **IAM Roles:** Temporary identities that can be assumed by trusted entities, services (e.g., EC2, Lambda), or federated users.
- **IAM Policies:** JSON documents that explicitly define allowed (`Allow`) or denied (`Deny`) actions, resources, and conditions.
- **Permissions:** Boundaries determining what operations an identity can perform on specific AWS services.

## 3. Principle of Least Privilege
Users and roles should only be granted the minimum necessary permissions required to perform their specific job functions, preventing accidental or unauthorized access.

## 4. IAM Best Practices
1. Lock down the AWS root user account and enable MFA.
2. Grant least privilege permissions using customer-managed policies.
3. Use IAM Roles for applications running on EC2 instead of storing hardcoded access keys.
4. Rotate access keys regularly.
5. Use IAM Groups to assign permissions rather than attaching policies directly to individual users.

## 5. Common Use Cases
- Allowing an EC2 instance to read/write objects in an S3 bucket via an attached IAM Instance Profile.
- Providing developers with restricted read-only access to staging environments while giving DevOps admins deploy permissions.
