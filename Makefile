.PHONY: start-dev
start-dev:
	docker-compose up -d

.PHONY: build-dev
build-dev:
	docker-compose build --no-cache

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate
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

.PHONY: remove-pkg-frontend-dev
remove-pkg-frontend-dev:
	docker-compose exec frontend npm uninstall $(p)
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
	rm -rf frontend/node_modules
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

.PHONY: reset-db-local
reset-db-local:
	docker-compose rm -sfv db
	docker-compose build db --no-cache
	make start-dev

#################################################################

.PHONY: wipe-files-dev
wipe-files-dev:
	find api/reports/ -type f ! -name '.gitignore' -exec rm {} +
	find api/report_tokens/ -type f ! -name '.gitignore' -exec rm {} +
	find api/files/json_bulk_validation_logs -type f ! -name '.gitignore' -exec rm {} +
	find api/files/bulk_validation_uploads -type f ! -name '.gitignore' -exec rm {} +
	find api/files/oauth_contacts -type f ! -name '.gitignore' -exec rm {} +
	make copy-seeds-dev

.PHONY: copy-seeds-dev
copy-seeds-dev:
	cp -a ./database/seeds/reports/. ./api/reports/
	cp -a ./database/seeds/report_tokens/. ./api/report_tokens/