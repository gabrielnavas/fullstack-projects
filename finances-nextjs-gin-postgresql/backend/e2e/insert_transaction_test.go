package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestInsertTransaction(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "batman da silva", "batman@email.com", "12345678")
	e2e.InsertTransaction(t, token)
}
