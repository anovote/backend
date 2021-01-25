FROM hayd/ubuntu-deno:latest

EXPOSE 1993

RUN apt install bash

RUN deno install -qAf --unstable https://deno.land/x/denon/denon.ts

WORKDIR /src

COPY . /src

CMD ["run", "--allow-env","--allow-net", "main.ts"]