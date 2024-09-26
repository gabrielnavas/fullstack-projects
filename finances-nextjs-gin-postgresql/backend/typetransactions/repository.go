package typetransactions

import "database/sql"

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
