.PHONY: build-api-dev
build-dev:
	docker build -t app -f ./api/Dockerfile.dev --no-cache .

.PHONY: recreate-api-dev
recreate-dev-dev:
	docker-compose rm -sfv api
	make build-api-dev
	make start-dev

.PHONY: start-dev
start-dev:
	docker-compose up -d

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate

.PHONY: migrate-local
migrate-local:
	docker-compose rm -sfv db
	docker-compose build db --no-cache
	make start-dev