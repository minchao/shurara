.PHONY: build build-with-docker clean docker-build

build: clean
	@echo Building app
	go build

build-with-docker:
	@echo Building app with Docker
	docker run --rm -v $(PWD):/go/src/github.com/minchao/shurara -w /go/src/github.com/minchao/shurara golang sh -c "make build"

clean:
	@echo Cleaning up previous build data
	rm shurara

docker-build: build-with-docker
	@echo Building Docker image
	cd webapp && make build-with-docker
	cd ..
	docker build -t minchao/shurara.com:latest .