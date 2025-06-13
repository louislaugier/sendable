.PHONY: install
install:
	docker compose exec frontend npm i $(p)
	make postinstall
	docker compose restart frontend

.PHONY: uninstall
uninstall:
	docker compose exec frontend npm uninstall $(p)
	make postinstall
	docker compose restart frontend

.PHONY: postinstall
postinstall:
	sh ./postinstall.sh

.PHONY: re
re:
	docker compose rm -sfv frontend
	docker compose build frontend --no-cache
	docker compose up -d frontend --force-recreate