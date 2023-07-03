HEADER My research development environment

# My research development environment

As a CS PhD student doing machine learning research, I usually have multiple projects going at once. These projects require different versions of libraries (e.g. PyTorch) or system setups (e.g. CUDA versions), so they cannot conflict with each other. I do development locally, but run most train and test jobs on the compute cluster, so I need consistency between the two, with different dataset locations handled at the environment level, not the client code level. These environments are also regularly subject to change; a package needs to be easy to add or update without being left in a broken state (e.g. due to bad uninstall routine), and if the env is broken, it's easy to roll back to a working one. Once changed, they need to be easy to synchronize with other systems without a painful rebuild process or the possibility of one system being left in a broken state. I also want the environments to be scrutable; the descriptions of how they were constructed need to be human readable and tracked by source control.

I need environments that are:

1. Self-contained -- no implicit system dependencies
2. Easy to distribute -- pull a binary image from an authoritative source
3. Self-describing -- script under source control to recreate the image from scratch or modify it for future needs
4. Checkpointed -- no doing a from scratch rebuild of the env because of a single bad command
5. File-system mappable -- inside the environment, everything needs to appear in a standard location on disk, even if the underlying filesystem stores the data in different folders

For these reasons, I do all of my development work inside Docker containers.

## Intro to Docker

Docker is a system for building and running _containers_. Each container holds a full system image -- you start with a base system image (e.g. [an Ubuntu image with CUDA and OpenGL preinstalled](https://hub.docker.com/r/nvidia/cudagl)), and then you modify it via a series of `bash` commands laid out in a `Dockerfile`. Once the container image is built, you can interactively run programs (such as your code) inside using the installed libraries. Your code and other folders such as data folders can be dynamically mounted into the container, allowing for live editing of your code from either inside the container, or outside on the base system (e.g. from an open text editor). Built images can be uploaded to [Docker Hub](https://hub.docker.com/), where they can be pulled down to another machine (e.g. the compute cluster), ensuring binary identical environments.

### The `Dockerfile`

Below is the `Dockerfile` I base my environments upon --- it uses an NVidia base image with CUDA 11.3 and OpenGL on Ubuntu 20.04. The `Dockerfile` performs some system setup, then installs `miniconda` (a minimal installer for the commonly used `conda` package manager), which it uses to install other standard packages: Python 3.10, PyTorch 1.12.1, and Open3D 0.17.


```
INCLUDE ./research_dev_env/docker/Dockerfile
```



```
INCLUDE ./research_dev_env/launch.sh
```

