package auth

import "api/shared"

type Auth struct {
	Username shared.Username
	Password shared.Password `json:"-"`
	Token    string
}

func (m *Auth) Validate() error {
	var err error

	err = m.Username.Validate()
	if err != nil {
		return err
	}

	return m.Password.Validate()
}
