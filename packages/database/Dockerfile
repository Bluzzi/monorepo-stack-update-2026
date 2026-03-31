FROM node:24-alpine
WORKDIR /app

# Enable PNPM:
RUN corepack enable

# Install dependencies:
COPY ./package.json5 ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY ./packages/database ./packages/database/

RUN pnpm install --frozen-lockfile

# Copy all folders and files:
COPY . .

# Define environment variables for execution:
ENV NODE_ENV="production"

# Run the server:
WORKDIR /app/packages/database
CMD pnpm run seed