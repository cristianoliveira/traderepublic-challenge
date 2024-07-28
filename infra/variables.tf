variable "dockerhub_username" {
  description = "GitHub token"
  type        = string
  default     = "trdockercris"
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS secret key"
  type        = string
}

variable "app_image_tag" {
  description = "Docker image tag for the app"
  type        = string
  default     = "main"
}
