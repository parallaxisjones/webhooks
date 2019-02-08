FROM mhart/alpine-node
EXPOSE 3000
RUN apk update && apk upgrade
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN rm ./package-lock.json
RUN npm install
CMD ["node", "src"]
