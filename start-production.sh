printf " \n - STARTING ANOVOTE PRODUCTION SETUP\n\n"

printf " \n\n--- SETINGUP HTTP FOLDER\n\n"
mkdir -p ../http/nginx
cp ./nginx-config/certbot.conf ../http/nginx

printf " \n\n--- SETTING UP CERTIFICATES\n\n"

./init-letsencrypt.sh

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

printf " \n\n--- BUILDING FRONTEND\n\n"

# FRONTEND BUILD
git checkout feature/add-docker-scripts
# ./anovote prod --build
# Go back from frontend path
cd ../backend

printf " \n\n--- STARTING BACKEND\n\n"

printf " \n\n--- MOVING PROXY CONFIG\n\n"
cp ./nginx-config/proxy.conf ../http/nginx
cp ./nginx-config/mime.types ../http/nginx

# BACKEND BUILD
./anovote prod --build