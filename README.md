# ANOVOTE BACKEND

[![Tests Status](https://github.com/anovote/backend/workflows/CI/badge.svg)](https://github.com/anovote/backend/actions)[![Spellchecker](https://github.com/anovote/backend/workflows/Spellchecker/badge.svg)](https://github.com/anovote/backend/actions)

## Table of contents

-   [General info](#general-info)
-   [Technologies](#technologies)
-   [Start development](#start-development)
    -   [Anovote CLI](#anovote-cli)
    -   [Local development](#local-development)
    -   [Docker development](#docker-development)

## General info

This is the backend repository for anovote, a digital anonymous voting system.

## Technologies

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

<!-- ## Anovote cli

The anovote CLI can be used to start or clean the development/production docker environment.

It is located in root directory, and may require execution access run > `chmod +x ./anovote`

### Commands

**Development**

`anovote dev` > starts development environment (db, server)

`anovote dev --build` > builds server image and starts containers (db, server)

`anovote dev --down` > stops development containers, removes all volumes and clear orphan child containers (All data in database is lost when running this command)

`anovote dev --force` > re-creates the containers and starts the environment

**Production**

**Commands available:**

`anovote prod` > starts production environment

`anovote prod --build` > builds server image, run tests, compiles typescript and creates a production image, the starts the containers (db, server)

`anovote prod --down` > stops production containers, removes all volumes and clear orphan child containers (All data in database is lost when running this command)

`anovote prod --force` > re-creates the containers and starts the environment

## Development

### Local

**Requirements**

-   Node
-   Yarn
-   Docker
-   Docker-compose

**Start**

1. Set .env variables in .env file in root see .env.example > some requirements
    1. DB_HOST must be localhost OR 127.0.0.1
    2. DB_PORT: 5432
2. run `yarn install`
3. run `docker-compose -f ./docker-compose.yml -f ./docker-compose-dev.yml up db`
4. run `yarn dev`
5. start coding
    1. Hot reloading is enabled so server restarts on code change in **src** directory

### Docker

-   Node (Optional)
-   Yarn (Optional)
-   Docker
-   Docker-compose

**Start**

1. Set .env variables in .env file in root see .env.example > some requirements
    1. DB_HOST must be anovote_database
    2. DB_PORT: 5432
2. run `./anovote dev --build`
    1. If image is already built run `./anovote dev`
    2. Might require execution permission > chmod +x ./anovote
3. (Optional) run `yarn install`
    1. This is only required for getting the types in the editor, not required for running as the container has its own node_modules folder
4. Start coding
    1. Hot reloading is enabled so server restarts on code change in **src** directory

## Production

### Local

**Requirements**

-   Node
-   Yarn
-   Docker
-   Docker-compose

**Start**

1. Set .env variables in .env file in root see .env.example > some requirements
    1. DB_HOST must be localhost OR 127.0.0.1
    2. DB_PORT: 5432
2. run `yarn install`
3. run `docker-compose -f ./docker-compose.yml -f ./docker-compose-prod.yml up db`
4. run `yarn test`
5. run `yarn build`
6. run `yarn prod`

### Docker

-   Node (Optional)
-   Yarn (Optional)
-   Docker
-   Docker-compose

**Start**

1. Set .env variables in .env file in root see .env.example > some requirements
    1. DB_HOST must be anovote_database
    2. DB_PORT: 5432
2. run `./anovote prod --build`
    1. If images is already built and no files have changed, run `./anovote prod`
    2. Might require execution permission > chmod +x ./anovote
       -->
