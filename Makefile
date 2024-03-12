.PHONY: start-dev
start-dev:
	docker-compose up -d

.PHONY: build-dev
build-dev:
	docker-compose build --no-cache

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate

#################################################################

.PHONY: build-api-dev
build-api-dev:
	docker build -t app -f ./api/Dockerfile.dev --no-cache .

.PHONY: recreate-api-dev
recreate-api-dev:
	docker-compose rm -sfv api
	make build-api-dev
	make start-dev

#################################################################

.PHONY: ssh-api-dev
ssh-api-dev:
	docker-compose exec api sh

#################################################################

.PHONY: migrate-local
migrate-local:
	docker-compose rm -sfv db
	docker-compose build db --no-cache
	make start-dev