#### api

- execute the database
```
docker-compose up
```

- wait for postgres to finish uploading and copy the sql from database/database.sql and run it in postgres with any client

- start http server
```bash
go run main
```

#### frontend
- copy .env.example to .env
- start http server
```
npm run dev
```