FROM node:0.10.35

MAINTAINER fundon cfddream@gmail.com

ADD . /bluewhale
WORKDIR /bluewhale

RUN npm install -g gulp
RUN npm install -g bower
RUN npm install
RUN bower install --allow-root
RUN npm run prepublish
