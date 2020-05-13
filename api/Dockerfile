FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
COPY . /app
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install --default-timeout=100 -r requirements.txt
ENV PYTHONPATH "${PYTHONPATH}:model"
ENV GOOGLE_APPLICATION_CREDENTIALS "firebase_key.json"

# CMD ["uvicorn", "app:app", "--port", "80", "--host", "0.0.0.0"]
CMD ["python", "app.py"]
