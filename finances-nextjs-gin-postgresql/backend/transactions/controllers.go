package transactions

import (
	"api/shared"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"
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

	var (
		createdAtLayoutISO  = "2006-01-02"
		createdAtFrom       *time.Time
		createdAtTo         *time.Time
		amountMin           *float64
		amountMax           *float64
		typeTransactionName *string
		categoryId          *string
		description         *string
		err                 error
	)

	if v := r.URL.Query().Get("amountMin"); v != "" {
		amountMinFloat, _ := strconv.ParseFloat(v, 64)
		if amountMinFloat <= 0.00 || amountMinFloat >= 2_000_000_0 {
			amountMax = nil
		} else {
			amountMin = &amountMinFloat
		}
	}
	if v := r.URL.Query().Get("amountMax"); v != "" {
		amountMaxFloat, _ := strconv.ParseFloat(v, 64)
		if amountMaxFloat <= 0.00 || amountMaxFloat >= 2_000_000_0 {
			amountMax = nil
		} else {
			amountMax = &amountMaxFloat
		}
	}
	if v := r.URL.Query().Get("typeTransactionName"); v != "" {
		typeTransactionName = &v
	}
	if v := r.URL.Query().Get("categoryId"); v != "" {
		categoryId = &v
	}
	if v := r.URL.Query().Get("description"); v != "" {
		if len(v) > 500 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "description is to long",
			})
		}
		description = &v
	}
	if v := r.URL.Query().Get("createdAtFrom"); v != "" {
		if d, err := time.Parse(createdAtLayoutISO, v); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "created at to missing layout iso: 2006-01-02",
			})
		} else {
			createdAtFrom = &d
		}
	}
	if v := r.URL.Query().Get("createdAtTo"); v != "" {
		if d, err := time.Parse(createdAtLayoutISO, v); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "created at from missing layout iso: 2006-01-02",
			})
		} else {
			createdAtTo = &d
		}
	}

	transactions, err := c.transactionService.FindTransactions(
		userId,
		amountMin,
		amountMax,
		typeTransactionName,
		description,
		categoryId,
		createdAtFrom,
		createdAtTo,
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
