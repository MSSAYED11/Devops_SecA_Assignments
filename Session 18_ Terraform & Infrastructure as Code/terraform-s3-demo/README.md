# Terraform S3 Bucket Demo

## 1. Project Overview
This project uses Terraform to provision an AWS S3 bucket with versioning enabled and environment tags.

## 2. Configuration Files
- `provider.tf`: Declares the required AWS provider and version constraints.
- `variables.tf`: Defines input variables for `aws_region`, `bucket_name`, and `environment`.
- `main.tf`: Defines the `aws_s3_bucket` and `aws_s3_bucket_versioning` resources.
- `outputs.tf`: Exports the bucket ID, ARN, and region.
- `terraform.tfvars`: Provides values for the variables.

## 3. Terraform Lifecycle Commands
```powershell
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform show
terraform output
terraform destroy
```
