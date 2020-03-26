FROM python:3.7-slim

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt
ENV FLASK_APP "api"
ENV FLASK_ENV "development"
ENV FLASK_RUN_PORT "8080"
ENV PYTHONPATH "${PYTHONPATH}:api:api/model"
CMD flask run --host=0.0.0.0


#FROM mhart/alpine-node:13
#WORKDIR /app/client
#RUN yarn run build
#
#FROM mhart/alpine-node
#RUN yarn global add serve
## continue here: How to set the port on which react is listening?
# EXPOSE 3000
#COPY --from=builder /app/client/build .
#CMD ["serve", "-p", "80", "-s", "."]
