package transactions

import (
	"api/shared"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type TransactionController struct {
	transactionService *TransactionService
}

func NewTransactionController(transactionService *TransactionService) *TransactionController {
	return &TransactionController{transactionService}
}

func (c *TransactionController) InsertTransaction(w http.ResponseWriter, r *http.Request) {
	// c.transactionService.InsertTransaction()
	userId := r.Context().Value(shared.USER_ID_KEY_CONTEXT).(string)

	var body InsertTransactionParams
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}
	_, err = c.transactionService.InsertTransaction(userId, body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Message: "transação realizada",
	})
}

func (c *TransactionController) FindTransactions(w http.ResponseWriter, r *http.Request) {
	var userId string = r.Context().Value(shared.USER_ID_KEY_CONTEXT).(string)

	amountMinStr := r.URL.Query().Get("amountMin")
	amountMaxStr := r.URL.Query().Get("amountMax")
	typeTransactionNameStr := r.URL.Query().Get("typeTransactionName")
	categoryIdStr := r.URL.Query().Get("categoryId")
	descriptionStr := r.URL.Query().Get("description")

	var amountMin *float64
	var amountMax *float64
	var typeTransactionName *string
	var categoryId *string
	var description *string
	var err error

	if amountMinStr != "" {
		amountMinFloat, _ := strconv.ParseFloat(amountMinStr, 64)
		amountMin = &amountMinFloat
	}
	if amountMaxStr != "" {
		amountMaxFloat, _ := strconv.ParseFloat(amountMaxStr, 64)
		amountMax = &amountMaxFloat
	}
	if typeTransactionNameStr != "" {
		typeTransactionName = &typeTransactionNameStr
	}
	if categoryIdStr != "" {
		categoryId = &categoryIdStr
	}
	if descriptionStr != "" {
		description = &descriptionStr
	}

	transactions, err := c.transactionService.FindTransactions(
		userId,
		amountMin,
		amountMax,
		typeTransactionName,
		description,
		categoryId,
	)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Data: transactions,
	})
}
