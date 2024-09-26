package typetransactions

import (
	"database/sql"
	"errors"
)

type TypeTransactionRepository struct {
	db  *sql.DB
	ttw *TypeTransactionWrapper
}

func NewTypeTransactionRepository(
	db *sql.DB,
	ttw *TypeTransactionWrapper,
) *TypeTransactionRepository {
	return &TypeTransactionRepository{db, ttw}
}

func (r *TypeTransactionRepository) FindTransactionById(id string) (*TypeTransaction, error) {
	sqlStatement := `
		SELECT id, name
		FROM public.type_transactions
		WHERE id = $1
	`
	row := r.db.QueryRow(sqlStatement, id)
	return r.ttw.RowToModel(row)
}

func (r *TypeTransactionRepository) FindTransactions() ([]*TypeTransaction, error) {
	sqlStatement := `
		SELECT id, name
		FROM public.type_transactions
	`
	rows, err := r.db.Query(sqlStatement)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}
	return r.ttw.RowsToModels(rows)
}
