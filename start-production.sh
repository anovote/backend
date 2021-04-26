#!/bin/bash
printf " \n - STARTING ANOVOTE PRODUCTION SETUP\n\n"

# Script to start ANOVOTE PRODUCTION SERVER
# Arguments:
# --build  -> build the production server, and pulls/clones frontend and builds it 

function taskDone()
{
    printf " \n----- DONE";
}

########################################################################
# Stop all containers before we relaunch
printf " \n\n--- STOPING OLD SERVICES\n\n"

./anovote prod --down

taskDone
########################################################################
# Prepare HTTP folder for NGINX, and copy nginx certbot config so we can start certbot wtih nginx as
# HTTP server for resolving certificates before we setup NGINX proxy and static file server.
printf " \n\n--- SETINGUP HTTP FOLDER\n\n"

mkdir -p ../http/nginx
cp ./nginx-config/certbot.conf ../http/nginx

taskDone
########################################################################

# Start certificate generation. This will prompt to recreate or skip if certificates alreadt exists.

printf " \n\n--- SETTING UP CERTIFICATES\n\n"

./init-letsencrypt.sh
./anovote prod --down

taskDone
########################################################################
# If build flag is provided or frontend does not exists we get the latest release of the frontend, and we build it.
# If the build flag is not provided and frontend exsits, we assume that the frontend exists, and does not contain updates
cd ..
if [[ "$1" == "--build" || ! -d "./frontend" ]]; then
    # Get the frontend from GitHub so we can build it

    printf " \n\n--- FETCHING FRONTEND\n\n"

    if [ -d "./frontend" ]  
    then
        cd frontend
        git pull
    else
        git clone https://github.com/anovote/frontend.git
        cd frontend
    fi

    # should be main.
    git checkout develop

    taskDone

########################################################################

    printf " \n\n--- BUILDING FRONTEND\n\n"

        # FRONTEND BUILD
        ./anovote prod --build
        # Remove container(s) after build
        ./anovote prod --down

    taskDone
# Go back from frontend path
    cd ..
fi
# go back to backend
cd backend

########################################################################

printf " \n\n--- MOVING PROXY CONFIG\n\n"
# Move production configs to HTTP folder
cp ./nginx-config/proxy.conf ../http/nginx
cp ./nginx-config/mime.types ../http/nginx

taskDone
########################################################################
printf " \n\n--- STARTING BACKEND\n\n"

# Build backend if build flag is set, else start it detached
if [[ "$1" == "--build" ]]; then
    # BACKEND BUILD
    ./anovote prod --build
else
    # BACKEND BUILD
    ./anovote prod -d
fi

printf " \n\n----- PRODUCTION STARTED\n\n"