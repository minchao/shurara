FROM ubuntu:16.04

RUN apt-get update
RUN mkdir /shurara

COPY shurara /shurara/
COPY docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT /docker-entrypoint.sh

VOLUME [ "/shurara/configs", "/shurara/www" ]

EXPOSE 8080
