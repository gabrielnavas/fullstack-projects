package categories

import (
	"api/typetransactions"
	"database/sql"
)

func MapDataToModel(data *CategoryData) (*Category, error) {
	var c Category

	c.ID = data.ID
	c.Name = data.Name
	c.Description = data.Description
	c.CreatedAt = data.CreatedAt
	c.UpdatedAt = data.UpdatedAt
	c.DeletedAt = data.DeletedAt
	c.TypeTransation = data.TypeTransaction

	return &c, nil
}

func MapRowsToManyData(rows *sql.Rows) ([]*CategoryData, error) {
	var categories []*CategoryData
	var ttName string
	for rows.Next() {
		var c CategoryData
		err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.CreatedAt,
			&c.UpdatedAt, &c.DeletedAt, &c.TypeTransaction.ID, &ttName)
		if err != nil {
			return nil, err
		}
		c.TypeTransaction.Name = typetransactions.NewTypeTransactionName(ttName)
		categories = append(categories, &c)
	}
	return categories, nil
}

func MapRowToData(row *sql.Row) (*CategoryData, error) {
	var c CategoryData
	var ttName string
	err := row.Scan(&c.ID, &c.Name, &c.Description, &c.CreatedAt,
		&c.UpdatedAt, &c.DeletedAt, &c.TypeTransaction.ID, &ttName)
	switch err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		c.TypeTransaction.Name = typetransactions.NewTypeTransactionName(ttName)
		return &c, nil
	default:
		return nil, err
	}
}
