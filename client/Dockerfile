FROM hoosin/alpine-nginx-nodejs:latest AS build-stage
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn run build

FROM hoosin/alpine-nginx-nodejs
WORKDIR /app
COPY --from=build-stage /app/build /usr/share/nginx/html/
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/configfile.template
# The port is defined by Google Cloud Run
ENV PORT 8080
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
EXPOSE 8080
# Run Nginx in the foreground - only for testing
CMD ["nginx","-g","daemon off;"]
