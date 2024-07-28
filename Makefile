.PHONY: help
help: ## Lists the available commands. Add a comment with '##' to describe a command.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST)\
		| sort\
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: terraform-version
terraform-version: ## Setup the right terraform version (Need because MacOS)
	TFENV_ARCH=amd64 tenv tf install 1.3.3
	tenv tf use 1.3.3

.PHONY: terraform-login
terraform-login: ## Initialize terraform
	terraform login

.PHONY: terraform-init
terraform-init: terraform-login ## Initialize terraform
	terraform -chdir=infra init

.PHONY: terraform-plan
terraform-plan: ## Start terraform plan
	terraform -chdir=infra plan

.PHONY: terraform-apply
terraform-apply: ## Start terraform apply
	terraform -chdir=infra apply

.PHONY: terraform-destroy
terraform-destroy: ## Start terraform destroy
	terraform -chdir=infra destroy

# required by terraform-plan
.PHONY: aws-configure
aws-configure: ## Configure AWS CLI with personal profile
	aws configure --profile personal

.PHONY: docker-push-image
docker-push-image: ## Create and push docker image to docker hub
	scripts/docker-build-image.sh
