FROM node:0.11.14

MAINTAINER fundon cfddream@gmail.com

ADD . /bluewhale
WORKDIR /bluewhale

RUN npm install -g gulp
RUN npm install -g bower
RUN npm install
RUN bower install -p --allow-root
RUN gulp build
RUN gulp images
RUN mv bower_components dist/
