FROM frolvlad/alpine-glibc

ENV DENO_VERSION=1.6.3

RUN apk add --virtual .download --no-cache curl \
    && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
    --output deno.zip \
    && unzip deno.zip \
    && rm deno.zip \
    && chmod 755 deno \
    && mv deno /bin/deno \
    && apk del .download

RUN addgroup -g 1993 -S deno \
    && adduser -u 1993 -S deno -G deno \
    && mkdir /deno-dir/ \
    && chown deno:deno /deno-dir/

ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local


EXPOSE 8000

RUN deno install --allow-read --allow-env --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts

WORKDIR /app


ENV PATH="/usr/local/bin:$PATH"

# CMD ["denon", "run", "--allow-env", "--allow-net" "-allow-write", "--allow-read", "httpServer.ts"]
