package products

import (
	"errors"
	"time"
)

type Product struct {
	ID          string     `gorm:"primaryKey" json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Price       float32    `json:"price"`
	Quantity    int64      `json:"quantity"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at" gorm:"autoUpdateTime:false"`
}

// TableName overrides the table name used by User to `profiles`
func (Product) TableName() string {
	return "products"
}

func (p *Product) Validate() error {
	var error string
	if len(p.Name) == 0 {
		error = "missing the name"
	} else if len(p.Name) > 100 {
		error = "name is too long"
	} else if len(p.Name) < 2 {
		error = "name is too short"
	}

	if len(p.Description) == 0 {
		error = "missing description"
	} else if len(p.Description) > 100 {
		error = "description is too long"
	} else if len(p.Description) < 2 {
		error = "description is too short"
	}

	if p.Price <= 0.00 {
		error = "price must be positive"
	}

	if float64(p.Quantity) <= 0 {
		error = "quantity must be positive"
	}

	if len(error) > 0 {
		return errors.New(error)
	}
	return nil
}
