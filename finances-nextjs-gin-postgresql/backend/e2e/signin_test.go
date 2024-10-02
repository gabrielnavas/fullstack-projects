package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestSignIn(t *testing.T) {
	e2e.DeleteData(t)
	params := struct {
		fullname string
		email    string
		password string
	}{
		fullname: "batman da silva",
		email:    "batman@email.com",
		password: "12345678",
	}
	_ = e2e.SignUp(t, params.fullname, params.email, params.password)
	_, _ = e2e.SignIn(t, params.email, params.password)
}
