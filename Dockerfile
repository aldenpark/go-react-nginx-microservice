# Build React frontend
FROM node:18 AS frontend
WORKDIR /app
COPY frontend/ /app
RUN npm install && npm run build

# Build Go backend
FROM golang:1.24 AS backend
# Set default environment variables ( These can be overridden at runtime using docker run -e or via docker-compose.yml. )
ENV API_PORT=8080
ENV STATIC_DIR=/usr/share/nginx/html
ENV APP_VERSION=1.0.3
WORKDIR /go-app
COPY backend/ ./
RUN go mod tidy && go build -o main .

# Final image: Nginx + backend
FROM nginx:alpine
COPY --from=frontend /app/build /usr/share/nginx/html
COPY --from=backend /go-app/main /usr/bin/backend
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh", "-c", "/usr/bin/backend & nginx -g 'daemon off;'"]
