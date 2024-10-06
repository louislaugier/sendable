.PHONY: all
all: start

start:
	docker-compose up -d
	make -C frontend postinstall

.PHONY: re
re:
	docker-compose build --no-cache
	docker-compose up -d --force-recreate
	make -C frontend postinstall
	make -C files re