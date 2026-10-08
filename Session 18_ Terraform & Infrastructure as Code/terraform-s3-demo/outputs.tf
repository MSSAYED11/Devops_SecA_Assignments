output "bucket_id" {
  description = "The ID/Name of the S3 bucket"
  value       = aws_s3_bucket.demo_bucket.id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.demo_bucket.arn
}

output "bucket_region" {
  description = "The AWS region of the S3 bucket"
  value       = var.aws_region
}
