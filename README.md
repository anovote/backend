# backend
All code regarding the backend server



### Starting docker

To build the docker container, run the following command:

~~~bash
docker build -t app .
~~~

To run the docker container, run the following command

```bash
docker run -it --init -p 1993:1993 app
```