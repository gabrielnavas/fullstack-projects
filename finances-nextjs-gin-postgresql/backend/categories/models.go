package categories

import (
	"time"
)

type Category struct {
	ID               string     `json:"id"`
	Name             string     `json:"name"`
	Description      string     `json:"description"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        *time.Time `json:"updatedAt,omitempty"`
	DeletedAt        *time.Time `json:"-"`
	TypeTransationID string     `json:"typeTransationId"`
}
