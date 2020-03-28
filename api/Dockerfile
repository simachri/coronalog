FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
COPY . /app
WORKDIR /app
# We manage the dependencies with pipenv. Keep in mind that we use the pip requirements.txt here.
# requirements.txt can be derived through pipenv lock --requirements > api/requirements.txt
RUN pip install -r requirements.txt
ENV PYTHONPATH "${PYTHONPATH}:model"
CMD ["python", "app.py"]
