FROM node:16.19.0-slim as build-stage

WORKDIR app/

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

EXPOSE 3000
CMD ["./scripts/launch.sh"]
