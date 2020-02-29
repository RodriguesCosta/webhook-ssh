FROM node:12.16.1

RUN mkdir /app-run
WORKDIR /app-run
COPY ./package.json /app-run
COPY ./yarn.lock /app-run
RUN yarn
ADD . /app-run
RUN yarn build
CMD ["yarn", "start"]
