package transactions

import (
	"api/typetransactions"
	"database/sql"
	"time"
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

func (r *TransactionRepository) UpdateTransaction(transactionID string, transaction *Transaction) error {
	sqlStatement := `
		UPDATE public.transactions
		SET amount=$1, description=$2, updated_at=$3, 
		type_transaction_id=$4, category_id=$5
		WHERE id=$6
	`
	_, err := r.db.Exec(
		sqlStatement,
		transaction.Amount, transaction.Description, transaction.UpdatedAt,
		transaction.TypeTransactionID, transaction.CategoryID, transactionID,
	)
	return err
}

func (r *TransactionRepository) FindTransactions(
	userId string,
	amountMin *float64,
	amountMax *float64,
	typeTransactionName *string,
	description *string,
	categoryId *string,
	createdAtFrom *time.Time,
	createdAtTo *time.Time,
) ([]*Transaction, error) {
	// Inicializa os argumentos para a query
	args := []interface{}{
		userId,
		amountMin,
		amountMax,
		description,
		typeTransactionName,
		categoryId,
	}

	if createdAtFrom != nil {
		d := createdAtFrom.Format("2006-01-02")
		args = append(args, d)
	} else {
		args = append(args, nil)
	}

	if createdAtTo != nil {
		d := createdAtTo.Format("2006-01-02")
		args = append(args, d)
	} else {
		args = append(args, nil)
	}

	// Prepara a query
	stmt, err := r.db.Prepare(r.findTransactionsSQL())
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, err
	}

	// Retorna os resultados
	return r.tw.RowsToModels(rows)
}

func (r *TransactionRepository) FindTransactionById(
	transactionId string,
) (*Transaction, error) {
	stmt, err := r.db.Prepare(r.findTransactionByIdSQL())
	if err != nil {
		return nil, err
	}

	row := stmt.QueryRow(transactionId)
	return r.tw.RowToModel(row)
}

func (r *TransactionRepository) findTransactionsSQL() string {
	return `
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
			AND ($7::TIMESTAMP IS NULL OR DATE(t.created_at) >= $7)
			AND ($8::TIMESTAMP IS NULL OR DATE(t.created_at) <= $8)
		ORDER BY t.created_at DESC, t.updated_at DESC
	`
}

func (r *TransactionRepository) findTransactionByIdSQL() string {
	return `
		SELECT 
			t.id, t.amount, t.description, t.created_at, 
			t.updated_at, t.deleted_at, t.user_id, 
			t.type_transaction_id, t.category_id
		FROM public.transactions AS t
		WHERE t.id = $1
	`
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
