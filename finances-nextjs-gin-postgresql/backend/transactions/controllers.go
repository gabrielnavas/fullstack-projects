package transactions

import (
	"api/categories"
	"api/shared"
	"api/typetransactions"
	"encoding/json"
	"errors"
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

func (c *TransactionController) DeleteTransaction(w http.ResponseWriter, r *http.Request) {
	// pega do parametro da url
	transactionId := chi.URLParam(r, "transactionId")
	if transactionId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing transaction id",
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

	// delete transaction
	err = c.ts.DeleteTransaction(transactionId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}

	w.WriteHeader(http.StatusNoContent)
}

type FindTransactionsParams struct {
	UserID              string
	Page                int
	PageSize            int
	CreatedAtFrom       *time.Time
	CreatedAtTo         *time.Time
	AmountMin           *float64
	AmountMax           *float64
	TypeTransactionName *string
	CategoryID          *string
	Description         *string
}

func (c *TransactionController) FindTransactions(w http.ResponseWriter, r *http.Request) {

	params, err := c.parseFindTransactionsParams(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "error! call the damin",
		})
		return
	}

	result, err := c.ts.FindTransactions(params)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Data: result,
	})
}

func (c *TransactionController) parseFindTransactionsParams(r *http.Request) (*FindTransactionsParams, error) {

	var (
		query             = r.URL.Query()
		params            = &FindTransactionsParams{}
		timeLayout        = "2006-01-02"
		userId     string = r.Context().Value(shared.USER_ID_KEY_CONTEXT).(string)
	)

	params.UserID = userId

	if pageStr := query.Get("page"); pageStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil {
			return nil, err
		}
		params.Page = page
	} else {
		params.Page = 0
	}

	if pageSizeStr := query.Get("pageSize"); pageSizeStr != "" {
		pageSize, err := strconv.Atoi(pageSizeStr)
		if err != nil {
			return nil, err
		}
		params.PageSize = pageSize
	} else {
		params.PageSize = 10
	}

	if createdAtFromStr := query.Get("createdAtFrom"); createdAtFromStr != "" {
		createdAtFrom, err := time.Parse(timeLayout, createdAtFromStr)
		if err != nil {
			return nil, err
		}
		params.CreatedAtFrom = &createdAtFrom
	}

	if createdAtToStr := query.Get("createdAtTo"); createdAtToStr != "" {
		createdAtTo, err := time.Parse(timeLayout, createdAtToStr)
		if err != nil {
			return nil, err
		}
		params.CreatedAtTo = &createdAtTo
	}

	if amountMinStr := query.Get("amountMin"); amountMinStr != "" {
		amountMin, err := strconv.ParseFloat(amountMinStr, 64)
		if err != nil {
			return nil, err
		}
		params.AmountMin = &amountMin
	}

	if amountMaxStr := query.Get("amountMax"); amountMaxStr != "" {
		amountMax, err := strconv.ParseFloat(amountMaxStr, 64)
		if err != nil {
			return nil, err
		}
		params.AmountMax = &amountMax
	}

	if typeTransactionName := query.Get("typeTransactionName"); typeTransactionName != "" {
		params.TypeTransactionName = &typeTransactionName
	}

	if categoryID := query.Get("categoryID"); categoryID != "" {
		params.CategoryID = &categoryID
	}

	if description := query.Get("description"); description != "" {
		params.Description = &description
	}

	return params, nil
}

func (c *TransactionController) SumAmountGroupByCategory(w http.ResponseWriter, r *http.Request) {

	params, err := c.parseSumAmountGroupByCategoryParams(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "error! call the damin",
		})
		return
	}

	result, err := c.ts.SumAmountGroupByCategory(params)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "missing body data",
		})
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Data: result,
	})
}

func (c *TransactionController) parseSumAmountGroupByCategoryParams(
	r *http.Request,
) (*SumAmountGroupByCategoryParams, error) {

	var (
		query             = r.URL.Query()
		params            = &SumAmountGroupByCategoryParams{}
		timeLayout        = "2006-01-02"
		userId     string = r.Context().Value(shared.USER_ID_KEY_CONTEXT).(string)
	)

	params.UserID = userId

	if createdAtFromStr := query.Get("createdAtFrom"); createdAtFromStr != "" {
		createdAtFrom, err := time.Parse(timeLayout, createdAtFromStr)
		if err != nil {
			return nil, err
		}
		params.CreatedAtFrom = &createdAtFrom
	} else {
		return nil, errors.New("missing query param created at from")
	}

	if createdAtToStr := query.Get("createdAtTo"); createdAtToStr != "" {
		createdAtTo, err := time.Parse(timeLayout, createdAtToStr)
		if err != nil {
			return nil, err
		}
		params.CreatedAtTo = &createdAtTo
	} else {
		return nil, errors.New("missing query param created at to")
	}

	if typeTransactionName := query.Get("typeTransactionName"); typeTransactionName != "" {
		params.TypeTransactionName = &typeTransactionName
	} else {
		return nil, errors.New("missing query param type transaction name")
	}

	return params, nil
}
