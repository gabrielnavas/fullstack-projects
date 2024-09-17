#### Database

1. Enter database directory and init docker compose dev 
```bash
cd database
docker-compose -f docker-compose-dev.yaml up
```

2. Enter api directory and copy .env.example to .env
```bash
cd api
cp .env.example .env
```