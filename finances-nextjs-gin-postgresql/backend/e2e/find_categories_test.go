package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestFindCategories(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "Robin Silvano", "robin@email.com", "12345678")
	e2e.FindCategories(t, token)
}
