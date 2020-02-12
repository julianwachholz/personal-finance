FROM node:13 AS build
WORKDIR /app
COPY web/package.json web/package-lock.json /app/web/
RUN cd /app/web && npm install

FROM build as dev
COPY . /app
RUN sed -i "s/localhost/api/" web/package.json
RUN cat web/package.json
CMD cd /app/web \
    && BROWSER=none npm start

FROM build as prod
ARG REACT_APP_SENTRY_DSN
COPY . /app
RUN export REACT_APP_RELEASE=$(git rev-parse HEAD) \
    && cd /app/web \
    && npm run build

FROM socialengine/nginx-spa:latest
COPY --from=prod /app/web/build /app
