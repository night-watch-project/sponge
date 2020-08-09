FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update

RUN apt install -y curl git

# Install Node.js 14
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs

# Install Firefox to make sure all of its dependencies are satisfied
RUN apt install -y firefox

# ...but remove Firefox itself
RUN dpkg -r firefox
