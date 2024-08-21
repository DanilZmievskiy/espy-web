FROM node:21-alpine

WORKDIR /app

COPY espy-api/package*.json ./
# COPY prisma ./prisma/

RUN npm install

COPY espy-api/ .

EXPOSE 3001

RUN npx prisma generate

CMD [ "npm", "run", "start" ]