package users

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"
	"time"
)

type User struct {
	ID           string     `id:"id"`
	FullName     string     `id:"fullname"`
	Email        string     `id:"email"`
	PasswordHash string     `id:"-"`
	CreatedAt    time.Time  `id:"createdAt"`
	UpdatedAt    *time.Time `id:"updatedAt"`
	DeletedAt    *time.Time `id:"-"`
}

func (u *User) Valid() error {
	// verify if have name and last name
	var fullNameSplited []string = strings.Split(u.FullName, " ")
	const maxNames = 10
	const minNames = 1
	const minName = 2
	const maxName = 15

	const maxPassword = 70
	const minPassword = 8

	if len(fullNameSplited) <= minNames {
		return errors.New("o nome completo deve ter um nome e sobrenome")
	} else if len(fullNameSplited) > maxNames {
		return errors.New("o nome completo deve ter no maxímo " +
			fmt.Sprintf("%d", maxNames) + " nomes")
	}

	// verify each name length
	for _, name := range fullNameSplited {
		var nameLength = len(name)
		if nameLength < minName {
			return errors.New("Cada nome de ter no mínimo " +
				fmt.Sprintf("%d", minName) +
				" caracteres")
		} else if nameLength > maxName {
			return errors.New("Cada nome de ter no máximo " +
				fmt.Sprintf("%d", maxName) +
				" caracteres")
		}
	}

	// verify email
	if _, err := mail.ParseAddress(u.Email); err != nil {
		return errors.New("e-mail está inválido")
	}

	//verify password
	var passwordLength = len(u.PasswordHash)
	if passwordLength < minPassword {
		return errors.New("A senha deve ter no mínimo " +
			fmt.Sprintf("%d", minPassword) +
			" caracteres")
	} else if passwordLength > maxPassword {
		return errors.New("A senha de ter no máximo " +
			fmt.Sprintf("%d", maxPassword) +
			" caracteres")
	}

	return nil
}
