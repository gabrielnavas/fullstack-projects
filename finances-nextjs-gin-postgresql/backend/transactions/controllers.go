package transactions

import (
	"api/shared"
	"encoding/json"
	"log"
	"net/http"
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

	transactions, err := c.transactionService.FindTransactions(userId)
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
