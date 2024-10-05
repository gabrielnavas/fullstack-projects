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

func (r *TransactionRepository) DeleteTransaction(transactionID string) error {
	sqlStatement := `
		UPDATE public.transactions
		SET deleted_at = $1
		WHERE id = $2
	`
	now := time.Now()
	_, err := r.db.Exec(
		sqlStatement, now, transactionID,
	)
	return err
}

func (r *TransactionRepository) FindTransactions(params *FindTransactionsParams) ([]*Transaction, error) {
	var offset int
	if params.Page == 0 {
		offset = 0
	} else {
		offset = params.Page * params.PageSize
	}

	args := []interface{}{
		params.UserID,
		offset,
		params.PageSize,
		params.AmountMin,
		params.AmountMax,
		params.Description,
		params.TypeTransactionName,
		params.CategoryID,
	}

	timeLayout := "2006-01-02"

	if params.CreatedAtFrom != nil {
		args = append(args, params.CreatedAtFrom.Format(timeLayout))
	} else {
		args = append(args, nil)
	}

	if params.CreatedAtTo != nil {
		args = append(args, params.CreatedAtTo.Format(timeLayout))
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
			AND t.deleted_at IS NULL
			AND ($4::DECIMAL(10, 2) IS NULL OR t.amount >= $4)
			AND ($5::DECIMAL(10, 2) IS NULL OR t.amount <= $5)
			AND ($6::VARCHAR(500) IS NULL OR t.description LIKE '%' || $6::VARCHAR(500) || '%')
			AND ($7::VARCHAR(10) IS NULL OR tt.name = $7)
			AND ($8::UUID IS NULL OR t.category_id = $8)
			AND ($9::TIMESTAMP IS NULL OR DATE(t.created_at) >= $9)
			AND ($10::TIMESTAMP IS NULL OR DATE(t.created_at) <= $10)
		ORDER BY t.created_at DESC, t.updated_at DESC
		OFFSET $2
		LIMIT $3
	`
}

type CountTransactionsParams struct {
	UserID              string
	CreatedAtFrom       *time.Time
	CreatedAtTo         *time.Time
	AmountMin           *float64
	AmountMax           *float64
	TypeTransactionName *string
	CategoryID          *string
	Description         *string
}

func (r *TransactionRepository) CountTransactions(
	params *CountTransactionsParams,
) (int, error) {
	args := []interface{}{
		params.UserID,
		params.AmountMin,
		params.AmountMax,
		params.Description,
		params.TypeTransactionName,
		params.CategoryID,
	}

	timeLayout := "2006-01-02"

	if params.CreatedAtFrom != nil {
		args = append(args, params.CreatedAtFrom.Format(timeLayout))
	} else {
		args = append(args, nil)
	}

	if params.CreatedAtTo != nil {
		args = append(args, params.CreatedAtTo.Format(timeLayout))
	} else {
		args = append(args, nil)
	}

	stmt, err := r.db.Prepare(r.countTransactionsSQL())
	if err != nil {
		return 0, err
	}
	row := stmt.QueryRow(args...)

	var count int

	switch err := row.Scan(&count); err {
	case sql.ErrNoRows:
		return 0, nil
	case nil:
		return count, nil
	default:
		return 0, err
	}
}

func (r *TransactionRepository) SumAmountGroupByCategory(
	params *SumAmountGroupByCategoryParams,
) ([]*SumAmountGroupByCategoryResult, error) {
	args := []interface{}{
		params.UserID,
		params.TypeTransactionName,
	}

	timeLayout := "2006-01-02"

	if params.CreatedAtFrom != nil {
		args = append(args, params.CreatedAtFrom.Format(timeLayout))
	} else {
		args = append(args, nil)
	}

	if params.CreatedAtTo != nil {
		args = append(args, params.CreatedAtTo.Format(timeLayout))
	} else {
		args = append(args, nil)
	}

	stmt, err := r.db.Prepare(r.sumAmountGroupByCategorySQL())
	if err != nil {
		return nil, err
	}
	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, err
	}

	ss := []*SumAmountGroupByCategoryResult{}

	for rows.Next() {
		var s SumAmountGroupByCategoryResult
		err := rows.Scan(&s.CategoryName, &s.Sum)
		if err != nil {
			return nil, err
		}
		ss = append(ss, &s)
	}

	return ss, nil
}

func (r *TransactionRepository) sumAmountGroupByCategorySQL() string {
	return `
		SELECT c.name, SUM(t.amount) 
		FROM transactions AS t
		LEFT JOIN public.type_transactions AS tt 
			ON tt.id = t.type_transaction_id
		LEFT JOIN public.users AS u 
			ON u.id = t.user_id
		LEFT JOIN public.categories AS c 
			ON c.id = t.category_id
		WHERE u.id = $1
			AND tt.name = $2
			AND DATE(t.created_at) >= $3
			AND DATE(t.created_at) <= $4
		GROUP BY c.name
	`
}

func (r *TransactionRepository) countTransactionsSQL() string {
	return `
		SELECT COUNT(*)
		FROM public.transactions AS t
		LEFT JOIN public.type_transactions AS tt ON tt.id = t.type_transaction_id
		WHERE t.user_id = $1
			AND t.deleted_at IS NULL
			AND ($2::DECIMAL(10, 2) IS NULL OR t.amount >= $2)
			AND ($3::DECIMAL(10, 2) IS NULL OR t.amount <= $3)
			AND ($4::VARCHAR(500) IS NULL OR t.description LIKE '%' || $4::VARCHAR(500) || '%')
			AND ($5::VARCHAR(10) IS NULL OR tt.name = $5)
			AND ($6::UUID IS NULL OR t.category_id = $6)
			AND ($7::TIMESTAMP IS NULL OR DATE(t.created_at) >= $7)
			AND ($8::TIMESTAMP IS NULL OR DATE(t.created_at) <= $8)
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
