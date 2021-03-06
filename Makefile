.PHONY: check-style validate-openapi build build-with-docker clean docker-build

PACKAGES=$(shell go list ./... | grep -v vendor)

.deps-install:
	@echo Getting dependencies using Glide
	go get -v -u github.com/Masterminds/glide
	glide install

	touch $@

vet:
	@echo Running go vet
	@go vet $(PACKAGES)

check-style: vet
	@echo Running go fmt
	$(eval GO_FMT_OUTPUT := $(shell go fmt $(PACKAGES)))
	@echo "$(GO_FMT_OUTPUT)"
	@if [ ! "$(GO_FMT_OUTPUT)" ]; then \
		echo "go fmt success"; \
	else \
		echo "go fmt failure"; \
		exit 1; \
	fi

validate-openapi:
	docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v3.2.3 validate --input-spec /local/openapi.yaml

build: .deps-install check-style
	@echo Building app
	cd cmd/shurara && go build -o ../../shurara

build-with-docker:
	@echo Building app with Docker
	docker run --rm -v $(PWD):/go/src/github.com/minchao/shurara -w /go/src/github.com/minchao/shurara golang sh -c "make build"

clean:
	@echo Cleaning up previous build data
	rm -f shurara
	rm -f .deps-install
	rm -rf vendor
