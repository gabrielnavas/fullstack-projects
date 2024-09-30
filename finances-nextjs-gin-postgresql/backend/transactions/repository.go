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

func (r *TransactionRepository) FindTransactions(
	userId string,
	amountMin *float64,
	amountMax *float64,
	typeTransactionName *string,
	description *string,
	categoryId *string,
) ([]*Transaction, error) {
	stmt, err := r.db.Prepare(`
		SELECT 
			t.id, t.amount, t.description, t.created_at, 
			t.updated_at, t.deleted_at, t.user_id, 
			t.type_transaction_id, t.category_id
		FROM public.transactions AS t
		LEFT JOIN public.type_transactions AS tt ON tt.id = t.type_transaction_id
		WHERE t.user_id = $1
			AND ($2::DECIMAL(10, 2) IS NULL OR t.amount >= $2)
			AND ($3::DECIMAL(10, 2) IS NULL OR t.amount <= $3)
			AND ($4::VARCHAR(500) IS NULL OR t.description LIKE '%' || $4::VARCHAR(500) || '%')
			AND ($5::VARCHAR(10) IS NULL OR tt.name = $5)
			AND ($6::UUID IS NULL OR t.category_id = $6)
		ORDER BY t.created_at DESC, t.updated_at DESC
		`)
	if err != nil {
		return nil, err
	}
	rows, err := stmt.Query(userId, amountMin, amountMax, description, typeTransactionName, categoryId)
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
