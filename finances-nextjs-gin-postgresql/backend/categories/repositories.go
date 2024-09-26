package categories

import (
	"database/sql"
)

type CategoryRepository struct {
	db *sql.DB
	cw *CategoryWrapper
}

func NewCategoryRepository(
	db *sql.DB,
	cw *CategoryWrapper) *CategoryRepository {
	return &CategoryRepository{db, cw}
}

func (r *CategoryRepository) FindCategoryByID(categoryID string) (*Category, error) {
	sqlStatement := `
		SELECT c.id, c.name, c.description, 
			c.created_at, c.updated_at, c.deleted_at, type_transaction_id
		FROM public.categories AS c
		LEFT JOIN public.type_transactions AS tt ON tt.id = c.type_transaction_id
		WHERE c.id = $1
	`
	row := r.db.QueryRow(sqlStatement, categoryID)
	return r.cw.RowToModel(row)
}

func (r *CategoryRepository) FindCategoriesByTypeName(typeName string) ([]*Category, error) {
	sqlStatement := `
		SELECT c.id, c.name, c.description, 
			c.created_at, c.updated_at, c.deleted_at, type_transaction_id
		FROM public.categories AS c
		LEFT JOIN public.type_transactions AS tt ON tt.id = c.type_transaction_id
		WHERE tt.name = $1
	`
	rows, err := r.db.Query(sqlStatement, typeName)
	if err != nil {
		return nil, err
	}
	return r.cw.RowsToModels(rows)
}
