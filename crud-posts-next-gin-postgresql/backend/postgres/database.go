package postgres

import (
	"database/sql"

	_ "github.com/lib/pq"
)

func OpenConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", "host=localhost port=5432 user=postgres password=postgres123 dbname=postgres sslmode=disable")
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	return db, err
}
