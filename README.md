# backend
All code regarding the backend server

## Starting docker

To build the backend in docker run the following command:

~~~bash
docker-compose up --build
~~~

### How to run on windows
Due to how the windows filesystem works, hot reloading the server in a docker container does not work. [More info](https://forums.docker.com/t/hot-reload-on-docker-desktop-windows/96432)

To fix the problem one has to edit the project under WSL. [How to install](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

In Visual Studio Code one can edit the project under WSL with [this extention](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

Start the project under wsl and run `docker-compose up --build` and watch the container update in realtime while you develop.