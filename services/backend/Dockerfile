FROM node:24-alpine
WORKDIR /app

# Enable PNPM:
RUN corepack enable

# Install dependencies:
COPY ./package.json5 ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY ./modules/backend/package.json ./modules/backend/

###########################
# GENERATED COPY COMMANDS #
###########################
COPY ./packages/database/ ./packages/database/
COPY ./services/backend/  ./services/backend/
###########################

RUN pnpm install --frozen-lockfile

# Copy all folders and files:
COPY . .

# Define environment variables for execution:
ENV NODE_ENV="production"

# Run the server:
WORKDIR /app/modules/backend
CMD pnpm run start