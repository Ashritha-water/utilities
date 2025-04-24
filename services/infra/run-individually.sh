docker run -p 3002:3002 -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_USER=postgres -e DB_PASSWORD=root -e DB_NAME=Consumers billing-service:test
docker run -p 3001:3001 -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_USER=postgres -e DB_PASSWORD=root -e DB_NAME=Policy policy-service:test
docker run -p 3005:3005 -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_USER=postgres -e DB_PASSWORD=root -e DB_NAME=Users user-service:test
