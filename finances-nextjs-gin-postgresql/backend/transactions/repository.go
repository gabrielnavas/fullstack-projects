package transactions

import (
	"api/typetransactions"
	"database/sql"
)

type TransactionRepository struct {
	db  *sql.DB
	tw  *TransactionWrapper
	ttw *typetransactions.TypeTransactionWrapper
}

func NewTransactionRepository(
	db *sql.DB,
	tw *TransactionWrapper,
	ttw *typetransactions.TypeTransactionWrapper,
) *TransactionRepository {
	return &TransactionRepository{db, tw, ttw}
}

func (r *TransactionRepository) InsertTransaction(t *Transaction) error {
	sqlStatement := `
		INSERT INTO public.transactions(
			id, amount, description, created_at, updated_at, deleted_at, user_id, 
			type_transaction_id, category_id
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
	`
	_, err := r.db.Exec(sqlStatement, t.ID, t.Amount, t.Description, t.CreatedAt,
		t.UpdatedAt, t.DeletedAt, t.UserID, t.TypeTransactionID, t.CategoryID)
	return err
}

func (r *TransactionRepository) FindTransactions(userId string) ([]*Transaction, error) {
	sqlStatement := `
			SELECT 
				id, amount, description, created_at, 
				updated_at, deleted_at, user_id, type_transaction_id, category_id
			FROM public.transactions
			WHERE user_id = $1
			ORDER BY created_at DESC, updated_at DESC
		`
	rows, err := r.db.Query(sqlStatement, userId)
	if err != nil {
		return nil, err
	}
	return r.tw.RowsToModels(rows)
}

func (r *TransactionRepository) FindTypeTransactionById(
	typeTransactionId string,
) (*typetransactions.TypeTransaction, error) {
	sqlStatement := `
		SELECT id, name
		FROM public.type_transactions
		WHERE id = $1
	`
	row := r.db.QueryRow(sqlStatement, typeTransactionId)
	return r.ttw.RowToModel(row)
}

func (r *TransactionRepository) FindTypeTransactionByName(
	typeTransactionName string,
) (*typetransactions.TypeTransaction, error) {
	sqlStatement := `
		SELECT id, name
		FROM public.type_transactions
		WHERE name = $1
	`
	row := r.db.QueryRow(sqlStatement, typeTransactionName)
	return r.ttw.RowToModel(row)
}
