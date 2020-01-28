FROM node:12-alpine AS build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
RUN npm run build

FROM socialengine/nginx-spa:latest
COPY --from=build /app/build /app
