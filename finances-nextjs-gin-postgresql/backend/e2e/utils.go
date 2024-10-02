package e2e

import (
	"api/postgresql"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

var (
	serverEndPoint = "http://localhost:3001/api"
)

func DeleteData(t *testing.T) {
	pg := postgresql.NewPostgreSQL(
		"localhost",
		"5433",
		"postgres",
		"postgres123",
		"postgres",
		"disable",
	)
	db, err := pg.Instance()
	assert.Nil(t, err)
	_, err = db.Exec(`
		delete from public.transactions;
		delete from public.users;
	`)
	assert.Nil(t, err)
}

func BeforeAuthAnyPrivate(t *testing.T, fullName, email, password string) (token string) {
	status := SignUp(
		t,
		fullName,
		email,
		password,
	)
	assert.Equal(t, status, http.StatusCreated)

	status, token = SignIn(t, email, password)
	assert.Equal(t, http.StatusCreated, status)
	assert.NotNil(t, token)

	return token
}
