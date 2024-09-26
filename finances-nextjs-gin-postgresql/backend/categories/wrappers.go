package categories

import (
	"database/sql"
)

type CategoryWrapper struct {
}

func NewCategoryWrapper() *CategoryWrapper {
	return &CategoryWrapper{}
}

func (w *CategoryWrapper) RowsToModels(rows *sql.Rows) ([]*Category, error) {
	var categories []*Category
	for rows.Next() {
		var c Category
		err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.CreatedAt,
			&c.UpdatedAt, &c.DeletedAt, &c.TypeTransationID)
		if err != nil {
			return nil, err
		}
		categories = append(categories, &c)
	}
	return categories, nil
}

func (w *CategoryWrapper) RowToModel(row *sql.Row) (*Category, error) {
	var c Category
	err := row.Scan(&c.ID, &c.Name, &c.Description, &c.CreatedAt,
		&c.UpdatedAt, &c.DeletedAt, &c.TypeTransationID)
	switch err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return &c, nil
	default:
		return nil, err
	}
}
