FROM node:16.19.0-slim as build-stage

WORKDIR app/

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html/
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
