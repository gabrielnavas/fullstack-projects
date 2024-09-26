package typetransactions

import "database/sql"

type TypeTransactionWrapper struct{}

func NewTypeTransactionWrapper() *TypeTransactionWrapper {
	return &TypeTransactionWrapper{}
}

func (ttw *TypeTransactionWrapper) RowToModel(row *sql.Row) (*TypeTransaction, error) {
	var t TypeTransaction
	err := row.Scan(&t.ID, &t.Name)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (ttw *TypeTransactionWrapper) RowsToModels(rows *sql.Rows) ([]*TypeTransaction, error) {
	var tts []*TypeTransaction

	for rows.Next() {
		var t TypeTransaction
		err := rows.Scan(&t.ID, &t.Name)
		if err != nil {
			return nil, err
		}
		tts = append(tts, &t)
	}

	return tts, nil
}
