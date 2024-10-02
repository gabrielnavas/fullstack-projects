package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestBeforeAuthAnyPrivate(t *testing.T) {
	e2e.DeleteData(t)
	_ = e2e.BeforeAuthAnyPrivate(t, "batman da silva", "batman@email.com", "12345678")
}
