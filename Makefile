.PHONY: start-api-dev
start-api-dev:
	make -C api start-dev

.PHONY: start-reacher
start-reacher:
	docker run -p 8080:8080 reacherhq/backend:latest