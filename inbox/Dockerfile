FROM python:3.9

ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN mkdir -p /inbox_app

COPY requirements.txt /inbox_app/requirements.txt

ADD . inbox_app/
WORKDIR /inbox_app

RUN pip install -r requirements.txt

ENV PYTHONPATH=/inbox_app

EXPOSE 4467

ENTRYPOINT [ "python", "handle_email.py" ]