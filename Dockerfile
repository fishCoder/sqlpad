FROM ubuntu:18.04

WORKDIR /app
ADD . /app


RUN cp -f sources.list /etc/apt/sources.list \
    && echo y | apt-get update \
    && echo y | apt-get install g++ make python-dev nodejs npm nodejs-dev node-gyp unixodbc-dev libsqliteodbc \
    && node -v \
    && npm install npm -g \
    && npm -v \
    && scripts/build.sh \
    && npm install -g serve

#koa 端口
EXPOSE 3000

CMD node server/server.js --dir /var/data/ --port 3000 --passphrase secret-encryption-phrase --save
