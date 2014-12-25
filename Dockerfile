FROM node:0.11.14

MAINTAINER fundon cfddream@gmail.com

ADD . /bluewhale
WORKDIR /bluewhale

RUN npm install -g gulp
RUN npm install
RUN gulp build
RUN gulp publish
