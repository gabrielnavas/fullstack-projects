package transactions

import (
	"api/typetransactions"
	"database/sql"
	"time"
)

type TransactionRepository struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) *TransactionRepository {
	return &TransactionRepository{db}
}

type TransactionData struct {
	ID               string
	Amount           float64
	TypeTransationID string
	CategoryID       string
	Description      string
	CreatedAt        time.Time
	UpdatedAt        *time.Time
	DeletedAt        *time.Time
	UserId           string
}

func (r *TransactionRepository) InsertTransaction(t *TransactionData) error {
	sqlStatement := `
		INSERT INTO public.transactions(
			id, amount, description, created_at, updated_at, deleted_at, user_id, 
			type_transaction_id, category_id
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
	`
	_, err := r.db.Exec(sqlStatement, t.ID, t.Amount, t.Description, t.CreatedAt,
		t.UpdatedAt, t.DeletedAt, t.UserId, t.TypeTransationID, t.CategoryID)
	return err
}

func (r *TransactionRepository) FindTypeTransactionById(typeTransactionId string) (*typetransactions.TypeTransactionData, error) {
	sqlStatement := `
		SELECT id, name
		FROM public.type_transactions
		WHERE id = $1
	`
	row := r.db.QueryRow(sqlStatement, typeTransactionId)
	return r.mapOneTypeTrasaction(row)
}

func (r *TransactionRepository) FindTypeTransactionByName(typeTransactionName string) (*typetransactions.TypeTransactionData, error) {
	sqlStatement := `
		SELECT id, name
		FROM public.type_transactions
		WHERE name = $1
	`
	row := r.db.QueryRow(sqlStatement, typeTransactionName)
	return r.mapOneTypeTrasaction(row)
}

func (r *TransactionRepository) mapOneTypeTrasaction(row *sql.Row) (*typetransactions.TypeTransactionData, error) {
	var tt typetransactions.TypeTransactionData
	var ttName string
	switch err := row.Scan(&tt.ID, &ttName); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return &tt, nil
	default:
		return nil, err
	}
}
