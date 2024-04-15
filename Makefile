.PHONY: start-dev
start-dev:
	docker-compose up -d

.PHONY: build-dev
build-dev:
	docker-compose build --no-cache

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreatefrom termi
	make postinstall-frontend-dev

#################################################################

.PHONY: postinstall-frontend-dev
postinstall-frontend-dev:
	sh frontend/postinstall.sh

.PHONY: install-pkg-frontend-dev
install-pkg-frontend-dev:
	docker-compose exec frontend npm i $(p)
	make postinstall-frontend-dev
	docker-compose restart frontend

#################################################################

.PHONY: build-api-dev
build-api-dev:
	docker-compose build api --no-cache

.PHONY: recreate-api-dev
recreate-api-dev:
	docker-compose rm -sfv api
	make build-api-dev
	make start-dev

.PHONY: build-frontend-dev
build-frontend-dev:
	docker-compose build frontend --no-cache

.PHONY: recreate-frontend-dev
recreate-frontend-dev:
	docker-compose rm -sfv frontend
	make build-frontend-dev
	make start-dev

#################################################################

.PHONY: build-frontend-prd
build-frontend-prd:
	docker-compose exec frontend npm run build
	make postbuild-frontend-dev

.PHONY: postbuild-frontend-dev
postbuild-frontend-dev:
	sh frontend/postbuild.sh

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
	make start-dev