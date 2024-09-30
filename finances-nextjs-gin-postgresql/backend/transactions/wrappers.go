package transactions

import (
	"database/sql"
)

type TransactionWrapper struct{}

func NewTransactionWrapper() *TransactionWrapper {
	return &TransactionWrapper{}
}

func (w *TransactionWrapper) RowToModel(row *sql.Row) (*Transaction, error) {
	var t Transaction
	switch err := row.Scan(
		&t.ID, &t.Amount, &t.Description, &t.CreatedAt, &t.UpdatedAt, &t.DeletedAt,
		&t.UserID, &t.TypeTransactionID, &t.CategoryID,
	); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return &t, nil
	default:
		return nil, err
	}
}

func (w *TransactionWrapper) RowsToModels(rows *sql.Rows) ([]*Transaction, error) {
	var ts []*Transaction = []*Transaction{}
	for rows.Next() {
		var t Transaction
		err := rows.Scan(
			&t.ID, &t.Amount, &t.Description, &t.CreatedAt, &t.UpdatedAt, &t.DeletedAt,
			&t.UserID, &t.TypeTransactionID, &t.CategoryID,
		)
		if err != nil {
			return nil, err
		}
		ts = append(ts, &t)
	}
	return ts, nil
}
