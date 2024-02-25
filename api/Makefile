.PHONY: build-dev
build-dev:
	docker build -t app -f Dockerfile.dev --no-cache .

.PHONY: start-dev
start-dev:
	docker-compose up -d

.PHONY: recreate-dev
recreate-dev:
	docker-compose up -d --force-recreate