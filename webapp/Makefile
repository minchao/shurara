.PHONY: lint build build-with-docker clean

.yarn-install:
	@echo Getting dependencies using yarn
	yarn install

	touch $@

lint: .yarn-install
	@echo Checking lint
	yarn run tslint

build: .yarn-install
	@echo Building webapp
	yarn run build

build-with-docker:
	@echo Building webapp with Docker
	docker run --rm -v $(PWD):/shurara -w /shurara node:6.11 sh -c "make build"

clean:
	@echo Cleaning up previous build data
	rm -f .yarn-install
	rm -rf dist node_modules