FROM node:20.16

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY *.js ./
COPY middleware/ ./middleware
COPY routes/ ./routes
COPY view/ ./view

CMD ["npm","run","start"]