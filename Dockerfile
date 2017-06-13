FROM ubuntu:16.04

RUN apt-get update
RUN mkdir /shurara

COPY shurara /shurara/
COPY webapp/dist /shurara/webapp/dist/
COPY docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT /docker-entrypoint.sh

EXPOSE 8080