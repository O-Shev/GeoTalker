FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
RUN chmod o+r -R /usr/share/nginx/html/

EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
