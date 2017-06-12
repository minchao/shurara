.PHONY: build docker-build clean

build: clean
	@echo Building app
	go build

docker-build:
	@echo Building app with Docker
	docker run --rm -v $(PWD):/go/src/github.com/minchao/shurara -w /go/src/github.com/minchao/shurara golang sh -c "make build"

clean:
	@echo Cleaning up previous build data
	rm shurara