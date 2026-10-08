variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Unique name for the S3 bucket"
  type        = string
  default     = "devops-homework-storage-bucket-2026"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "Development"
}
