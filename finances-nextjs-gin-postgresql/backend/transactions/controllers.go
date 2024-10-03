package transactions

import (
	"api/categories"
	"api/shared"
	"api/typetransactions"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

type TransactionController struct {
	ts *TransactionService
	tt *typetransactions.TypeTransactionService
	c  *categories.CategoryService
}

func NewTransactionController(
	ts *TransactionService,
	tt *typetransactions.TypeTransactionService,
	c *categories.CategoryService,
) *TransactionController {
	return &TransactionController{ts, tt, c}
}

func (c *TransactionController) InsertTransaction(w http.ResponseWriter, r *http.Request) {
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
	_, err = c.ts.InsertTransaction(userId, body)
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

func (c *TransactionController) UpdatePartialsTransaction(w http.ResponseWriter, r *http.Request) {
	// userId := r.Context().Value(shared.USER_ID_KEY_CONTEXT).(string)

	// pega do parametro da url
	transactionId := chi.URLParam(r, "transactionId")
	if transactionId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing transaction id",
		})
		return
	}

	// pegar dados do POST body
	var body UpdateTransactionParams
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
		return
	}

	// verificar se a transaction existe
	transaction, err := c.ts.FindTransactionById(transactionId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
		return
	}
	if transaction == nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "transaction not found",
		})
		return
	}

	typeTransaction, err := c.tt.FindTypeTransactionById(body.TypeTransactionID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "type transaction not found",
		})
		return
	}

	category, err := c.c.FindCategoryByID(body.CategoryID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "type transaction not found",
		})
		return
	}

	transaction.Amount = body.Amount
	transaction.CategoryID = category.ID
	transaction.Description = body.Description
	transaction.TypeTransactionID = typeTransaction.ID

	// update transaction
	err = c.ts.UpdatePartialsTransaction(transactionId, transaction)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}

	w.WriteHeader(http.StatusNoContent)
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

	transactions, err := c.ts.FindTransactions(
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
