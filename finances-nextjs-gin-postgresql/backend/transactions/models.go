package transactions

import (
	"api/categories"
	"api/typetransactions"
	"api/users"
	"errors"
	"fmt"
	"time"
)

type Transaction struct {
	ID             string                          `json:"id"`
	Amount         float64                         `json:"amount"`
	TypeTransation typetransactions.TypeTransation `json:"typeTransation"`
	User           users.User                      `json:"user"`
	Category       categories.Category             `json:"category"`
	Description    string                          `json:"description"`
	CreatedAt      time.Time                       `json:"createdAt"`
	UpdatedAt      *time.Time                      `json:"updatedAt"`
	DeletedAt      *time.Time                      `json:"-"`
}

func (t *Transaction) Valid() error {
	var minAmout float64 = 0.01
	var maxAmout float64 = 1_999_999.99

	var minDescription = 1
	var maxDescription = 500

	if t.Amount < minAmout {
		return errors.New("O valor deve ser no mínimo " + fmt.Sprintf("%f", minAmout))
	}

	if t.Amount > maxAmout {
		return errors.New("O valor deve ser no máximo " + fmt.Sprintf("%f", maxAmout))
	}

	if len(t.Description) < minDescription {
		return errors.New("A descrição deve ser no mínimo " + fmt.Sprintf("%f", minDescription))
	}

	if len(t.Description) > maxDescription {
		return errors.New("A descrição deve ser no máximo " + fmt.Sprintf("%f", maxDescription))
	}

	return nil
}
