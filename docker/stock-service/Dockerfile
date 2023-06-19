## Stage 1. Compile TS sources to JS
FROM node:lts as builder
# Set build directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY ./package*.json ./*.lock ./tsconfig.json ./tsconfig.build.json ./nest-cli.json ./

# Install dev dependencies
RUN npm install

# Copy sources
COPY ./apps/stock-service ./apps/stock-service
COPY ./config ./config
COPY ./libs ./libs
COPY ./.env ./.env

# Build app
RUN npm run build:stocks
## Stage 2. Run built app
# Note: node:12-alpine could not be used here due to weak bcrypt support:
# https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#alpine-linux-based-images
FROM node:lts
# Set app directory
WORKDIR /usr/src/app

ENV NODE_ENV production
# Install app dependencies
COPY package.json ./
RUN npm install --omit=dev

COPY ./.env ./.env
COPY --from=builder /usr/src/app/dist/apps/stock-service ./dist

EXPOSE 3113

CMD ["node", "dist/main"]
