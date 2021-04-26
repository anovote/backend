#!/bin/bash
printf " \n - STARTING ANOVOTE PRODUCTION SETUP\n\n"

function taskDone()
{
    printf " \n----- DONE";
}

########################################################################

printf " \n\n--- STOPING OLD SERVICES\n\n"

./anovote prod --down

taskDone
########################################################################

printf " \n\n--- SETINGUP HTTP FOLDER\n\n"

mkdir -p ../http/nginx
cp ./nginx-config/certbot.conf ../http/nginx

taskDone
########################################################################

printf " \n\n--- SETTING UP CERTIFICATES\n\n"

./init-letsencrypt.sh
./anovote prod --down

taskDone
########################################################################

printf " \n\n--- FETCHING FRONTEND\n\n"

cd ..
if [ -d "./frontend" ] 
then
    cd frontend
    git pull
else
    git clone https://github.com/anovote/frontend.git
    cd frontend
fi

git checkout develop

taskDone
########################################################################

printf " \n\n--- BUILDING FRONTEND\n\n"

./anovote prod --down

if [[ "$1" == "--build" ]]; then
    # FRONTEND BUILD
    ./anovote prod --build
    ./anovote prod --down
fi

# Go back from frontend path
cd ../backend

taskDone
########################################################################

printf " \n\n--- MOVING PROXY CONFIG\n\n"

cp ./nginx-config/proxy.conf ../http/nginx
cp ./nginx-config/mime.types ../http/nginx

taskDone
########################################################################
printf " \n\n--- STARTING BACKEND\n\n"

if [[ "$1" == "--build" ]]; then
    # BACKEND BUILD
    ./anovote prod --build
else
    # BACKEND BUILD
    ./anovote prod -d
fi

printf " \n\n----- PRODUCTION STARTED\n\n"