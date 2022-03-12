# we start from a base image and name it build
FROM node:16-stretch as Build

# Create app directory
WORKDIR /usr/src/app

# Note that, rather than copying the entire working directory, we are only copying the package.json file.
# This allows us to take advantage of cached Docker layers. See more: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# the yarn install --frozen-lockfile command is the equivalant of npm ci command, specified in the comments, helps provide faster, reliable, reproducible builds for production environments.
# see more: https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# we copy the code base over to build
# the reason we do this at a diffrent layer is to optomize docker cache
COPY . .

# set environemnt variables
ENV NODE_ENV=production

# set the databse url or the build will fail
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG PUBLIC_ADMIN_URL
ENV PUBLIC_ADMIN_URL=${PUBLIC_ADMIN_URL}

# run the build script
RUN yarn build

# -------------------------------------
# runtime stage
# starting from a size optimized image. this reduces the size of the final image and reduces security risks
FROM gcr.io/distroless/nodejs:16 as Runtime

# use a less previlaged user for security reasons
USER nonroot
# # create a new folder and make it the current working directory
# RUN mkdir /home/node/code
# WORKDIR /home/node/code

# copy the build from the previous image
COPY --from=Build --chown=nonroot:nonroot /usr/src/app/ ./app
WORKDIR /app

# set environemnt variables
ENV NODE_ENV=production

# expose the port the app is listening on
EXPOSE 5000

CMD [ "node_modules/.bin/strapi", "start" ]



