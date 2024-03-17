.PHONY: start-dev
start-dev:
	docker-compose up -d
	postinstall-frontend

.PHONY: build-dev
build-dev:
	docker-compose build --no-cache

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate

#################################################################

.PHONY: postinstall-frontend
postinstall-frontend:
	sh frontend/postinstall.sh

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
	docker-compose exec frontend sh

#################################################################

.PHONY: migrate-local
migrate-local:
	docker-compose rm -sfv db
	docker-compose build db --no-cache
	start-dev