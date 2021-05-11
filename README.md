# ANOVOTE BACKEND

<img src="anovote-logo.jpg">

[![CI](https://github.com/anovote/backend/workflows/CI/badge.svg)](https://github.com/anovote/backend/actions/workflows/ci.yml)
[![Spellchecker](https://github.com/anovote/backend/workflows/Spellchecker/badge.svg)](https://github.com/anovote/backend/actions/workflows/spellchecker.yml)

## Table of contents

-   [General info](#general-info)
-   [Technologies](#technologies)
    -   [Backend Technologies](#backend-technologies)
    -   [Test Technologies](#test-technologies)
-   [Start development](#start-development)
    -   [Anovote CLI](#anovote-cli)
    -   [Local development](#local-development)
    -   [Docker development](#docker-development)
-   [Building Anovote stack](#building-anovote-stack)

## General info

This project aims to solve the server-side of the Anovote application, a digital anonymous voting system. Anovote aims to implement \
a voting solution that can perform secure, digital and anonymous elections. It is required that the solution secures the anonymity \
of eligible voters, that a vote cannot be modified and that the voter is validated and approved prior to the election.

## Technologies

### Backend Technologies

-   [TypeScript](https://www.typescriptlang.org/)
-   [Node](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/)
-   [Express](https://expressjs.com/)
-   [TypeORM](https://typeorm.io/#/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Socket.io](https://socket.io/)
-   [Nodemailer](https://nodemailer.com/about/)
-   [Node cron](https://www.npmjs.com/package/node-cron)
-   [Docker/Docker compose](https://www.docker.com/)
-   [Nginx](https://www.nginx.com/)
-   [Certbot](https://certbot.eff.org/)

### Test Technologies

-   [Jest](https://jestjs.io/)

## Start development

### Anovote CLI

The anovote backend comes with an Anovote CLI, which can be used to start or clean the development environment. \
Since the anovote CLI is located in the root folder, you may have to run `chmod +x ./anovote` for execution access. \
It is therefore recommended to run the Anovote CLI on a linux based system.

To be able to use the Anovote CLI, Docker and Docker compose needs to be installed on the device.

The Anovote CLI comes with the following commands:

-   `anovote dev`, which starts the development environment (database and server).
-   `anovote dev --build`, which builds server images and starts containers.
-   `anovote dev --down`, which stops the development containers, removes all volumes and clear all orphan child containers.
-   `anovote dev --force`, which re-creates the containers and starts the development environment.

### Local development

#### Requirements

-   Node
-   Yarn
-   Docker
-   Docker compose

#### Start

1. Create an `.env` file in the root of the project based on the existing `.env-example`
    1. `DB_HOST` must be "localhost" OR "127.0.0.1".
    2. `DB_PORT` must be "5432"
2. Run `yarn install`
3. Run `docker-compose -f ./docker-compose.yml -f ./docker-compose-dev.yml up db`
4. Run `yarn dev`
5. Let the code fly!
    1. Hot reloading is enabled, so the server restarts on code change in the `src` directory.

### Docker development

#### Requirements

-   Docker
-   Docker compose
-   Node (Optional)
-   Yarn (Optional)

#### Start

1. Create an `.env` file in the root of the project based on the existing `.env-example`
    1. `DB_HOST` must be "anovote_database"
    2. `DB_PORT` must be "5432"
2. (Optional) Run `yarn install`
    1. This is only required for getting the types in your editor, but is not required for running as the container has its own node_modules folder.
3. Run `./anovote dev --build`
    1. If the images are already built, run `./anovote dev`
    2. As described in the [Anovote CLI](#anovote-cli) section, this might require execution permission.
4. Let the code fly!
    1. Hot reloading is enabled, so the server restarts on code change in the `src` directory.

## Building Anovote stack

_Currently the Anovote stack is built from the backend. The anovote team is planning to move the building of the Anovote stack
out of the backend repository._

The anovote backend is also responsible for building the anovote stack, this means fetching and building the frontend, setting
up a NGINX proxy and fetching certificates. \
By running the `start-production.sh` bash script, the following will happen:

1. Stop any old production services still running
2. Set up a HTTP folder which will be used by the NGINX proxy
3. Creates SSL certificates used by the NGINX proxy if they do not exists.
4. Fetching the Anovote frontend repository from GitHub.
5. Build the anovote frontend, which makes a static index.html served by the NGINX proxy.
6. Configures the NGINX proxy.
7. Starts the Anovote backend.
