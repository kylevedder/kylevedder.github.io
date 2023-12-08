FROM ubuntu:focal
SHELL ["/bin/bash", "-c"]
# Set the timezone info because otherwise tzinfo blocks install 
# flow and ignores the non-interactive frontend command 🤬🤬🤬
RUN ln -snf /usr/share/zoneinfo/America/New_York /etc/localtime && echo "/usr/share/zoneinfo/America/New_York" > /etc/timezone
RUN apt update -y
RUN apt install pandoc pandoc-citeproc exiftool texlive-latex-extra -y
RUN apt install python3-pip -y
RUN apt install git -y
RUN pip3 install --no-cache-dir --force-reinstall git+https://github.com/sciunto-org/python-bibtexparser@main
RUN apt install tidy -y
WORKDIR /project
