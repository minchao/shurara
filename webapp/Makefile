.PHONY: yarn-install build docker-build clean

yarn-install: clean
	@echo Getting dependencies using yarn
	yarn install

build: yarn-install
	@echo Building webapp
	yarn run build

docker-build:
	@echo Building webapp with Docker
	docker run --rm -v $(PWD):/shurara -w /shurara node:6.11 sh -c "make build"

clean:
	@echo Cleaning up previous build data
	rm -rf dist node_modules