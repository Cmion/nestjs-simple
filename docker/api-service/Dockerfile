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
COPY ./.env ./.env
COPY ./prisma ./prisma
#
## Generate Prisma client
RUN npx prisma generate

# Copy sources
COPY ./apps/api-service ./apps/api-service
COPY ./config ./config
COPY ./libs ./libs

RUN npm run build

## Stage 2. Run built app
FROM node:lts

# Set app directory
WORKDIR /usr/src/app

ENV NODE_ENV production

# Install app dependencies
COPY package.json ./
RUN npm install --omit=dev

COPY ./.env ./.env
COPY ./prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Perform Prisma database migrations
RUN npx prisma db push

# Copy compiled output from the first stage
COPY --from=builder /usr/src/app/dist/apps/api-service ./dist

# Expose port for use
EXPOSE 3112

CMD ["node", "dist/main"]
