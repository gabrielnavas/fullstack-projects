package categories

import (
	"api/typetransactions"
	"time"
)

type Category struct {
	ID             string                          `json:"id"`
	Name           string                          `json:"name"`
	Description    string                          `json:"description"`
	CreatedAt      time.Time                       `json:"createdAt"`
	UpdatedAt      *time.Time                      `json:"updatedAt,omitempty"`
	DeletedAt      *time.Time                      `json:"-"`
	TypeTransation typetransactions.TypeTransation `json:"typeTransation"`
}
