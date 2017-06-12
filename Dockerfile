FROM ubuntu:16.04

RUN apt-get update
RUN mkdir /shurara

COPY shurara /shurara/
COPY webapp/dist /shurara/webapp/dist/

WORKDIR /shurara
ENTRYPOINT ["/shurara/shurara"]

EXPOSE 8080