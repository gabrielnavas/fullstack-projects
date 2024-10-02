package postgresql

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type PostgreSQL struct {
	db *sql.DB
}

func NewPostgreSQL(host,
	port,
	user,
	password,
	dbname,
	sslmode string) PostgreSQL {

	dataSourceName := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode,
	)
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}
	return PostgreSQL{db}
}

func (pg *PostgreSQL) Instance() (*sql.DB, error) {
	err := pg.db.Ping()
	return pg.db, err
}
