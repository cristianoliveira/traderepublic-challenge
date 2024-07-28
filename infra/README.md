# App infra

Deploy your own instance to AWS.

First add your credentials in `terraform.tfvars` file.
See: `./terraform.tfvars-example`

- Create an account in AWS
- Obtain your AWS credentials `aws_access_key` & `aws_secret_key`
- To deploy create your ECR repository `aws_ecr_url` & `aws_ecr_repo_name`
- Create a new user on IAM and set in `aws_iam_user_arn` the user must contain
  access to ECR, EC2, ECS, Route53, S3, Certificate Manager, and CloudFront.

