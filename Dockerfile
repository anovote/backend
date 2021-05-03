FROM node:15.8.0 as runtime

# SETUP SOURCE / DEV 
FROM runtime as source
# Tells node that we run in development
ENV NODE_ENV=development

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

CMD ["yarn", "dev"]
# ===================================

# BUILD PROJECT 
FROM source as build
# Tells node that we run in production
ENV NODE_ENV=production
RUN yarn build
# ===================================


# CREATE PRODUCTION IMAGE
FROM runtime as production
# Tells node that we run in production
ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/dist/ dist/
COPY --from=build /app/package.json .

# Installs only dependencies that is listen in dependencies, and not devDependecies
RUN yarn install --production

CMD ["yarn", "prod"]
# ===================================
