package transactions

import (
	"api/categories"
	"api/typetransactions"
	"api/users"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)

type TransactionService struct {
	tr   *TransactionRepository
	tmw  *TransactionWrapper
	ttmw *typetransactions.TypeTransactionWrapper
	cs   *categories.CategoryService
	us   *users.UserService
}

func NewTransactionService(
	tr *TransactionRepository,
	tmw *TransactionWrapper,
	ttmw *typetransactions.TypeTransactionWrapper,
	cs *categories.CategoryService,
	us *users.UserService,
) *TransactionService {
	return &TransactionService{
		tr,
		tmw,
		ttmw,
		cs,
		us,
	}
}

type InsertTransactionParams struct {
	Amount              float64 `json:"amount"`
	TypeTransactionName string  `json:"typeTransactionName"`
	CategoryID          string  `json:"categoryId"`
	Description         string  `json:"description"`
}

func (s *TransactionService) InsertTransaction(userID string, params InsertTransactionParams) (*Transaction, error) {
	userByEmail, err := s.us.FindUserById(userID)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if userByEmail == nil {
		return nil, errors.New("user not found")
	}

	typeTransation, err := s.tr.FindTypeTransactionByName(params.TypeTransactionName)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if typeTransation == nil {
		return nil, errors.New("type transaction not found")
	}

	category, err := s.cs.FindCategoryByID(params.CategoryID)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if category == nil {
		return nil, errors.New("category not found")
	}

	transaction := Transaction{
		ID:                uuid.NewString(),
		Amount:            params.Amount,
		Description:       params.Description,
		CreatedAt:         time.Now(),
		UserID:            userByEmail.ID,
		CategoryID:        category.ID,
		TypeTransactionID: typeTransation.ID,
	}
	err = transaction.Valid()
	if err != nil {
		return nil, err
	}

	err = s.tr.InsertTransaction(&transaction)
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (s *TransactionService) FindTransactionById(
	transactionId string,
) (*Transaction, error) {
	t, err := s.tr.FindTransactionById(transactionId)
	if err != nil {
		return nil, err
	}
	return t, nil
}

type UpdateTransactionParams struct {
	Amount            float64 `json:"amount"`
	TypeTransactionID string  `json:"typeTransactionId"`
	CategoryID        string  `json:"categoryId"`
	Description       string  `json:"description"`
}

func (s *TransactionService) UpdatePartialsTransaction(
	trasactionID string,
	t *Transaction,
) error {
	now := time.Now()
	t.UpdatedAt = &now
	err := s.tr.UpdateTransaction(trasactionID, t)
	if err != nil {
		fmt.Println(err)
		return errors.New("error! call admin")
	}
	return nil
}

func (s *TransactionService) DeleteTransaction(trasactionID string) error {
	err := s.tr.DeleteTransaction(trasactionID)
	if err != nil {
		fmt.Println(err)
		return errors.New("error! call admin")
	}
	return nil
}

func (s *TransactionService) FindTransactions(params *FindTransactionsParams) ([]*Transaction, error) {
	ts, err := s.tr.FindTransactions(params)
	if err != nil {
		return nil, err
	}

	return ts, nil
}
