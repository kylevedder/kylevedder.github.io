#!/bin/bash
xhost +
touch `pwd`/docker_history.txt
docker run --gpus=all --rm -it \
 -v `pwd`:/project \
 -v `pwd`/docker_history.txt:/root/.bash_history \
 -v /tmp/.X11-unix:/tmp/.X11-unix \
 -e DISPLAY=$DISPLAY \
 -h $HOSTNAME \
 --privileged \
 kylevedder/research_dev_env:latest
