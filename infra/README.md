# App infra

This folder contains the infrastructure code for the app. 

### Disclaimer

Since the opportunity is for a fullstack position, I decided to focus not only
on the frontend but backend and infrastructure as well using AWS, Docker, and terraform.
I wanted to show that I am familiar with the tools for deployment and infrastructure as code.
(disclaimer) I'm not an expert in infrastructure, but I have some experience with it.
for a real project, I would suggest using a managed service like Vercel or Netlify, which
allows to focus more on the code and less on the infrastructure and provides
a simpler setup for CI/CD, Test environment and deployment.

### Ideal infrastructure

The SPA goes to an S3 bucket and the BE goes to an EC2 instance or ECS containers.
To support millions of WebSocket connections, we could make the SPA to connect to a load balancer that distributes the connections across different servers per region. To distribute the messages equally we could use a message broker like Kafka to handle message routing and load distribution.

See `../architecture.png` (in the root folder) for a visual representation.

## Prerequisites

### For infrastructure management

  - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) and an account
  - [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
  - [Terraform Cloud](https://app.terraform.io/) account

### For local development and image generation

  - [Docker](https://docs.docker.com/guides/getting-started/)
  - [Docker Hub](https://hub.docker.com/) account as an alternative to AWS ECR

## Usage

First add your credentials in `terraform.tfvars` file.
See: `./terraform.tfvars-example`

**All commands assume you are inside of this folder**

- Get your AWS credentials `aws_access_key` & `aws_secret_key`
  With the AWS CLI you can run `aws configure` to set them up.

- Get your Terraform Cloud credentials
  Do `terraform login` and connect your account.
  it allows deploy this app to a test environment in the AWS cloud.

- Get your Docker Hub credentials
  with docker do `docker login` and connect your account.
  it allows you to push the image to the registry.
