package env

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	PgHost     string
	PgPort     string
	PgUser     string
	PgPassword string
	PgDbName   string
	PgSslMode  string

	JwtSecretKey         string
	JwtExpirationSeconds int64

	ServerPort string
)

func init() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	JwtSecretKey = os.Getenv("JWT_SECRET_KEY")
	JwtExpirationSeconds, err = strconv.ParseInt(os.Getenv("JWT_EXPIRATION_SECONDS"), 10, 64)
	if err != nil {
		panic(err)
	}

	PgHost = os.Getenv("PG_HOST")
	PgPort = os.Getenv("PG_PORT")
	PgUser = os.Getenv("PG_USER")
	PgPassword = os.Getenv("PG_PASSWORD")
	PgDbName = os.Getenv("PG_DBNAME")
	PgSslMode = os.Getenv("PG_SSLMODE")

	ServerPort = os.Getenv(("HTTP_SERVER_PORT"))
}
