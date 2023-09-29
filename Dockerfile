# FROM node:16.17.0 as angular
FROM node:latest as fabian
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest
WORKDIR /usr/local/apache2/htdocs
COPY --from=fabian /app/dist/fabian /usr/share/nginx/html
EXPOSE 80