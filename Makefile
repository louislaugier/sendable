.PHONY: all
all: start

start:
	docker-compose up -d
	make -C frontend postinstall
	make -C api stripe-dev

.PHONY: re
re:
	docker-compose build --no-cache
	docker-compose up -d --force-recreate
	make -C frontend postinstall
	make -C files re

.PHONY: deploy
deploy:
	$(eval $(shell cat .env | sed 's/^/export /'))
	sshpass -e ssh root@$(SERVER_IP_ADDRESS) "cd sendable && git pull"