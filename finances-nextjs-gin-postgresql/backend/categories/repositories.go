package categories

import (
	"api/typetransactions"
	"database/sql"
	"time"
)

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{db}
}

type CategoryData struct {
	ID              string
	Name            string
	Description     string
	CreatedAt       time.Time
	UpdatedAt       *time.Time
	DeletedAt       *time.Time
	TypeTransaction typetransactions.TypeTransation
}

func (r *CategoryRepository) FindCategoryByID(categoryID string) (*CategoryData, error) {
	sqlStatement := `
		SELECT c.id, c.name, c.description, 
			c.created_at, c.updated_at, c.deleted_at,
			tt.id, tt.name
		FROM public.categories AS c
		LEFT JOIN public.type_transactions AS tt ON tt.id = c.type_transaction_id
		WHERE c.id = $1
	`
	row := r.db.QueryRow(sqlStatement, categoryID)
	return MapRowToData(row)
}

func (r *CategoryRepository) FindCategoriesByTypeName(typeName string) ([]*CategoryData, error) {
	sqlStatement := `
		SELECT c.id, c.name, c.description, 
			c.created_at, c.updated_at, c.deleted_at,
			tt.id, tt.name
		FROM public.categories AS c
		LEFT JOIN public.type_transactions AS tt ON tt.id = c.type_transaction_id
		WHERE tt.name = $1
	`
	rows, err := r.db.Query(sqlStatement, typeName)
	if err != nil {
		return nil, err
	}
	return MapRowsToManyData(rows)
}
