package auth

import (
	"errors"
)

type Auth struct {
	Username string `json:"username"`
	Password string `json:"-"`
	Token    string `json:"token"`
}

func (m *Auth) Validate() error {
	var err error

	if len(m.Username) == 0 {
		err = errors.New("username is empty")
	} else if len(m.Username) > 50 {
		err = errors.New("username is too long")
	} else if len(m.Username) > 50 {
		err = errors.New("username is too long")
	} else if len(m.Password) < 8 {
		err = errors.New("password must be longer than 8 characters")
	} else if len(m.Password) >= 71 {
		err = errors.New("password must be less than 71 characters")
	}

	return err
}
