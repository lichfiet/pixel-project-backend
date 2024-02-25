# import config.
# You can change the default config with `make cnf="config_special.env" build`
cnf ?= ./env/config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help


# DOCKER TASKS
# Build the container
build: ## Build the container

	@echo "\n${BCyan}...Building Web Container Image...${NC} \n"

	docker build -t $(APP_NAME):dev --platform linux/amd64 -f ./docker/build.Dockerfile .

	@echo "\n${BCyan}...Launching Dev Server...${NC} \n"

build-nc: ## Build the container without no cache
	docker build -t $(APP_NAME):dev --platform linux/amd64 --no-cache -f ./docker/build.Dockerfile .

start: ## Start node and redis in docker compose

	@echo "\n${BCyan}...Launching Dev Server...${NC} \n"

	docker compose -f ./docker/compose.yaml up -d

	@echo "\n${BWhite}Hold ctrl and click this link 'http://localhost:8000'${NC}\n"

stop: ## stop docker compose

	@echo "\n${BCyan}...Stopping Docker Containers...${NC} \n"

	docker compose -f ./docker/compose.yaml down

# Clean Up
clean: # Remove images, modules, and cached build layers

	rm -rf node_modules
	rm -rf package-lock.json
	-docker stop webserv
	-docker rm webserv
	-docker image rm game
	rm -rf log

init: # Initailize development environment and start it

	chmod u+x ./make/dev-init.sh
	./make/dev-init.sh

	@echo "\n${BCyan}...Building Web Container Image...${NC} \n"

	docker build -t $(APP_NAME):dev --platform linux/amd64 -f ./docker/build.Dockerfile .

prod: ## Run for production

	chmod u+x ./make/dev-init.sh
	./make/dev-init.sh

	@echo "\n${BCyan}...Building Web Container Image...${NC} \n"

	docker build -t $(APP_NAME):latest --platform linux/amd64 -f ./docker/build.Dockerfile .

	@echo "\n${BCyan}...Launching Dev Server...${NC} \n"

	docker compose -f ./docker/prod-compose.yaml up -d

	@echo "\n${BWhite}Hold ctrl and click this link 'http://localhost:8000'${NC}\n"