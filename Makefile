.PHONY: start-dev
start-dev:
	docker-compose up -d

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate


.PHONY: build-api-dev
build-dev:
	docker build -t app -f ./api/Dockerfile.dev --no-cache .

.PHONY: recreate-api-dev
recreate-api-dev:
	docker-compose rm -sfv api
	make build-api-dev
	make start-dev


.PHONY: migrate-local
migrate-local:
	docker-compose rm -sfv db
	docker-compose build db --no-cache
	make start-dev


# ssh into api container
.PHONY: ssh-api-dev
ssh-api-dev:
	docker-compose exec api bin/bash