package shared

import "errors"

type Username struct {
	Value string
}

func (p *Username) Validate() error {
	if len(p.Value) == 0 {
		return errors.New("username is empty")
	} else if len(p.Value) > 50 {
		return errors.New("username is too long")
	} else if len(p.Value) > 50 {
		return errors.New("username is too long")
	}

	return nil
}

type Password struct {
	Value string
}

func (p *Password) Validate() error {
	if len(p.Value) < 8 {
		return errors.New("password must be longer than 8 characters")
	} else if len(p.Value) >= 71 {
		return errors.New("password must be less than 71 characters")
	}

	return nil
}
