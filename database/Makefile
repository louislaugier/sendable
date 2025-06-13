.PHONY: re
re:
	docker compose rm -sfv db
	docker compose build db --no-cache
	docker compose up -d db --force-recreate