.PHONY: re
re:
	find ./reports/ -type f ! -name '.gitignore' -exec rm {} +
	find ./report_tokens/ -type f ! -name '.gitignore' -exec rm {} +
	find ./json_bulk_validation_logs -type f ! -name '.gitignore' -exec rm {} +
	find ./bulk_validation_uploads -type f ! -name '.gitignore' -exec rm {} +
	find ./oauth_contacts -type f ! -name '.gitignore' -exec rm {} +
	cp -a ./mock/reports/. ./reports/
	cp -a ./mock/report_tokens/. ./report_tokens/
	