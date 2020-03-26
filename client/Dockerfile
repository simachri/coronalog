FROM mhart/alpine-node:13 AS node_build
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=node_build /app/build .
CMD ["serve", "-l", "8080", "-s", "."]
