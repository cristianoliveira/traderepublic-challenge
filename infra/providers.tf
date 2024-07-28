terraform {
  required_version = ">= 0.13"
  required_providers {
    aws = {
      version = ">= 2.0"
      source  = "hashicorp/aws"
    }
  }
}

terraform {
  cloud {
    organization = "cristianoliveiradev"

    workspaces {
      name = "tr-challenge"
    }
  }
}

provider "aws" {
  region  = "us-west-2"
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
}
