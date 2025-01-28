FROM python:3.13

RUN apt-get update \
    && apt-get install -y build-essential default-libmysqlclient-dev \
    && pip install --no-cache-dir --upgrade pip

WORKDIR /app
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt
COPY .. /app

EXPOSE 5000

CMD ["python", "main.py"]

