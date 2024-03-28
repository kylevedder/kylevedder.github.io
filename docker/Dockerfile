FROM ubuntu:focal
SHELL ["/bin/bash", "-c"]
# Set the timezone info because otherwise tzinfo blocks install 
# flow and ignores the non-interactive frontend command 🤬🤬🤬
RUN ln -snf /usr/share/zoneinfo/America/New_York /etc/localtime && echo "/usr/share/zoneinfo/America/New_York" > /etc/timezone
RUN apt update -y
RUN apt install wget exiftool texlive-latex-extra -y
RUN wget https://github.com/jgm/pandoc/releases/download/3.1.11.1/pandoc-3.1.11.1-1-amd64.deb -O /tmp/pandoc.deb
RUN apt install /tmp/pandoc.deb -y
RUN apt install git curl wget nano -y

# Install miniconda to /miniconda
RUN curl -LO http://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN bash Miniconda3-latest-Linux-x86_64.sh -p /miniconda -b
RUN rm Miniconda3-latest-Linux-x86_64.sh
ENV PATH=/miniconda/bin:${PATH}
RUN conda update -y conda

RUN conda install python=3.11 pip -y
RUN pip install --no-cache-dir --force-reinstall git+https://github.com/sciunto-org/python-bibtexparser@main
RUN pip install requests
WORKDIR /project
