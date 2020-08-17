FROM node:12-alpine AS builder

# Change working directory 
WORKDIR /app

# Install npm production packages
COPY package.json .npmrc ./
RUN npm install --production

# Copy application source
COPY . ./
RUN rm .npmrc


FROM node:12-alpine

# Update packages and install dependency packages for services
# RUN  echo 'Finished installing dependencies'

# Change working directory
WORKDIR /app

# Copy application from builder stage
COPY --from=builder /app ./

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm","run","test"]