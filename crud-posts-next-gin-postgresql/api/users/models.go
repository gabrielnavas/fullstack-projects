package users

import (
	"api/shared"
	"time"
)

type User struct {
	ID        string
	Username  shared.Username
	Password  shared.Password `json:"-"`
	CreatedAt time.Time
	UpdatedAt *time.Time
}

func (u *User) Validate() error {
	err := u.Username.Validate()
	if err != nil {
		return err
	}

	return u.Password.Validate()
}
