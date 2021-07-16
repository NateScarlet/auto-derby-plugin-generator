.PHONY: build deploy

build:
	rm -rf dist
	pnpm run build

deploy: REMOTE_URL=$(shell git remote get-url origin)
deploy: build
	set -ex \
	&& cd dist \
	&& echo > .nojekyll \
	&& git init \
	&& git add --all \
	&& git commit -m "chore: deploy github pages" \
	&& git push -f $(REMOTE_URL) HEAD:gh-pages \
