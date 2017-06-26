.PHONY: build build-with-docker clean docker-build

.deps-install:
	@echo Getting dependencies using Glide
	go get -v -u github.com/Masterminds/glide
	glide install

	touch $@

build: .deps-install
	@echo Building app
	go build

build-with-docker:
	@echo Building app with Docker
	docker run --rm -v $(PWD):/go/src/github.com/minchao/shurara -w /go/src/github.com/minchao/shurara golang sh -c "make build"

clean:
	@echo Cleaning up previous build data
	rm -f shurara
	rm -f .deps-install
	rm -rf vendor

docker-build: clean build-with-docker
	@echo Building Docker image
	cd webapp && make clean && make build-with-docker
	cd ..
	docker build -t minchao/shurara.com:latest .