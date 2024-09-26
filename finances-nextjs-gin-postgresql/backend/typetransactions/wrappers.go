package typetransactions

import "database/sql"

type TypeTransactionWrapper struct{}

func NewTypeTransactionWrapper() *TypeTransactionWrapper {
	return &TypeTransactionWrapper{}
}

func (ttw *TypeTransactionWrapper) RowToModel(row *sql.Row) (*TypeTransaction, error) {
	var t TypeTransaction
	var tName string
	err := row.Scan(&t.ID, &tName)
	if err != nil {
		return nil, err
	}
	t.Name = NewTypeTransactionName(tName)
	return &t, nil
}
