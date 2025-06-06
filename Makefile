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

# redeploy app
.PHONY: deploy
deploy:
	make -C deploy app

# redeploy compose config
.PHONY: deploy-compose
deploy-compose:
	make -C deploy compose

# redeploy dockerfiles
.PHONY: deploy-build
deploy-build:
	make -C deploy build