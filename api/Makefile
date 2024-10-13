.PHONY: re
re:
	docker-compose rm -sfv api
	docker-compose build api --no-cache
	docker-compose up -d api --force-recreate

.PHONY: stripe-dev
stripe-dev:
	stripe listen --load-from-webhooks-api --forward-to localhost