FROM node:lts as frontend
WORKDIR /frontend
COPY frontend .
RUN npm install
RUN npm run build

FROM python:3.11

RUN mkdir /app
WORKDIR /app
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC
RUN apt-get update && apt-get install -y libffi-dev python3-dev git

RUN pip install uwsgi

COPY backend/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY backend /app/
COPY --from=frontend /frontend/build /app/build
COPY urly_uwsgi.ini /app/.

RUN python manage.py collectstatic --noinput