.PHONY: start-dev
start-dev:
	docker-compose up -d
	postinstall-frontend-dev

.PHONY: build-dev
build-dev:
	docker-compose build --no-cache

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate

#################################################################

.PHONY: postinstall-frontend-dev
postinstall-frontend-dev:
	sh frontend/postinstall.sh

.PHONY: install-pkg-frontend-dev
install-pkg-frontend-dev:
	npm i $(p)
	postinstall-frontend-dev

#################################################################

.PHONY: build-api-dev
build-api-dev:
	docker build -t app -f ./api/Dockerfile.dev --no-cache .

.PHONY: recreate-api-dev
recreate-api-dev:
	docker-compose rm -sfv api
	make build-api-dev
	start-dev

#################################################################

.PHONY: ssh-api-dev
ssh-api-dev:
	docker-compose exec api sh

.PHONY: ssh-frontend-dev
ssh-frontend-dev:
	docker-compose exec frontend bash

#################################################################

.PHONY: migrate-local
migrate-local:
	docker-compose rm -sfv db
	docker-compose build db --no-cache
	start-dev