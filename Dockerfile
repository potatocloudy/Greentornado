FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN  apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git \
        build-base \
        cairo-dev \
        jpeg-dev \
        pango-dev \
        musl-dev \
        giflib-dev \
        pixman-dev \
        pangomm-dev \
        libjpeg-turbo-dev \
        freetype-dev \
    && apk --no-cache add \
        pixman \
        cairo \
        pango \
        giflib \
        libjpeg \
        freetype \ 
        fontconfig \
    && apk --no-cache add \
       ttf-roboto \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    && npm install \
    && apk del .gyp

COPY . .

ENV PORT=80
EXPOSE 80

CMD node Bot.js

