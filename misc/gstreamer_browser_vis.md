HEADER Linux box in the browser for visualization with GStreamer

# Linux box in the browser for visualization with GStreamer


## The docker image

```
FROM ghcr.io/ehfd/nvidia-glx-desktop:latest

SHELL ["/bin/bash", "-c"]

# Core system packages
RUN sudo apt-get update --fix-missing
RUN sudo apt install -y software-properties-common wget curl gpg gcc git make

# Install miniconda to /miniconda
RUN curl -LO http://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN bash Miniconda3-latest-Linux-x86_64.sh -p $HOME/miniconda -b
RUN rm Miniconda3-latest-Linux-x86_64.sh
ENV PATH=~/miniconda/bin:${PATH}
RUN conda update -y conda

RUN sudo apt install -y apt-utils

# Additional dev packages
RUN sudo apt install -y --no-install-recommends libssl-dev libmodule-install-perl libboost-all-dev libopenblas-dev
RUN sudo apt install -y locate nano

RUN conda update conda -y

ENV TORCH_CUDA_ARCH_LIST="Ampere;Turing;Pascal"
ENV FORCE_CUDA="1"

RUN conda install python=3.8 -y
RUN conda install cmake
RUN sudo apt-get update --fix-missing
RUN sudo apt install -y x11-apps x11-utils locate libc++-7-dev libc++abi-7-dev xorg-dev mesa-utils ca-certificates curl gnupg lsb-release
RUN conda init

RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN sudo sh get-docker.sh
RUN sudo usermod -aG docker $USER
RUN sudo apt install -y uidmap
RUN dockerd-rootless-setuptool.sh install

RUN distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
      && curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
      && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
            sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
            sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
RUN  sudo apt-get update && sudo apt-get install -y nvidia-docker2
RUN rm get-docker.sh

RUN sudo apt-get install apt-transport-https ca-certificates gnupg
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN sudo apt-get update
RUN sudo apt-get -y install google-cloud-cli

RUN conda install joblib matplotlib numpy cmake
RUN pip install av2
RUN pip install open3d==0.15.2 

COPY entrypoint.sh /etc/entrypoint.sh
RUN sudo chmod 755 /etc/entrypoint.sh

RUN echo "cd ~/project" >> ~/.bashrc
```

## The launch file

```
docker run --gpus 1 -it \
-e TZ=UTC \
-e SIZEW=1600 \
-e SIZEH=900 \
-e REFRESH=60 \
-e DPI=96 \
-e CDEPTH=24 \
-e VIDEO_PORT=DFP \
-e PASSWD=pass \
-e WEBRTC_ENCODER=x264enc \
-e NOVNC_ENABLE=true \
-e BASIC_AUTH_PASSWORD=pass \
-v `pwd`/:/home/user/project \
-v /efs:/Datasets \
-v /efs/scratch/:/scratch:rw \
-v /efs/driver_store:/driver_store:rw \
-v /var/run/docker.sock:/var/run/docker.sock:rw \
-p 8080:8080 \
xenv_streamer:latest
```