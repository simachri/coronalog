FROM python:3.7-slim

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV FLASK_APP "."
# Flask shall run on its default port 3000. React has a proxy to it an listens to the outer world.
ENV FLASK_RUN_PORT "8080"
ENV PYTHONPATH "${PYTHONPATH}:model"
CMD ["flask", "run", "--host=0.0.0.0"]
