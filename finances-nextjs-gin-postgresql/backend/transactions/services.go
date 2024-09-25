package transactions

import (
	"api/categories"
	"api/typetransactions"
	"api/users"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
)

type TransactionService struct {
	transactionRepository *TransactionRepository
	categoryService       *categories.CategoryService
	userService           *users.UserService
}

func NewTransactionService(
	transactionRepository *TransactionRepository,
	categoryService *categories.CategoryService,
	userService *users.UserService,
) *TransactionService {
	return &TransactionService{
		transactionRepository,
		categoryService,
		userService,
	}
}

type InsertTransactionParams struct {
	Amount              float64 `json:"amount"`
	TypeTransactionName string  `json:"typeTransactionName"`
	CategoryID          string  `json:"categoryId"`
	Description         string  `json:"description"`
}

func (s *TransactionService) InsertTransaction(userID string, params InsertTransactionParams) (*Transaction, error) {
	userByEmail, err := s.userService.FindUserById(userID)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if userByEmail == nil {
		return nil, errors.New("user not found")
	}

	typeTransationData, err := s.transactionRepository.FindTypeTransactionByName(params.TypeTransactionName)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if typeTransationData == nil {
		return nil, errors.New("type transaction not found")
	}

	category, err := s.categoryService.FindCategoryByID(params.CategoryID)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if category == nil {
		return nil, errors.New("category not found")
	}

	transaction := Transaction{
		ID:             uuid.NewString(),
		Amount:         params.Amount,
		Description:    params.Description,
		CreatedAt:      time.Now(),
		User:           *userByEmail,
		Category:       *category,
		TypeTransation: typetransactions.DataToModel(typeTransationData),
	}
	err = transaction.Valid()
	if err != nil {
		return nil, err
	}

	data := &TransactionData{
		ID:               transaction.ID,
		Amount:           transaction.Amount,
		Description:      transaction.Description,
		CreatedAt:        time.Now(),
		UserId:           transaction.User.ID,
		CategoryID:       category.ID,
		TypeTransationID: transaction.TypeTransation.ID,
	}
	err = s.transactionRepository.InsertTransaction(data)
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}
