FROM node:20-alpine
ARG GIT_COMMIT

ENV APP_COMMIT ${GIT_COMMIT}
ENV PORT 80

WORKDIR /authentication-client

# Copy files
COPY package.json yarn.lock tsconfig.json ./
COPY src ./src

# Compile code
RUN yarn install && \
    yarn compile && \
    # Remove dev dependencies
    yarn install --production && \
    # Remove unecessary files
    rm package.json yarn.lock tsconfig.json

ENV NODE_ENV production
EXPOSE 80

# Set start command
WORKDIR /authentication-client/build
CMD [ "yarn", "start" ]
