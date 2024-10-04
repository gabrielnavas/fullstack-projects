package e2e_test

import (
	"api/e2e"
	"fmt"
	"testing"
	"time"
)

func TestFindTransaction(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "Robin Silvano", "robin@email.com", "12345678")

	cs := e2e.FindCategories(t, token)
	tts := e2e.FindTypeTransactions(t, token)

	typeTransaction := tts[0]
	category := cs[0]
	description := "lorem lorem lorem lorem lorem"

	e2e.InsertTransaction(t, token, category.ID, typeTransaction.Name, description, 50.95)
	e2e.FindTransactions(t, token)
}

func TestFindCategoriesWithQueries(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "Robin Silvano", "robin@email.com", "12345678")

	var (
		pageSize            = 5
		today               = time.Now()
		tomorow             = today.Add(time.Hour * 24)
		timeLayout          = "2006-01-02"
		typeTransactionName string
		categoryID          string
		description         = "lorem lorem lorem lorem lorem"
	)

	// insert 10 transactions
	for i := 0; i < 10; i++ {
		cs := e2e.FindCategories(t, token)
		tts := e2e.FindTypeTransactions(t, token)
		categoryID = cs[0].ID
		typeTransactionName = tts[0].Name
		e2e.InsertTransaction(t, token, categoryID, typeTransactionName, description, 50.95)
	}

	pages := []int{0, 1}

	for _, page := range pages {
		queryParams := map[string]string{
			"amountMin":           "0",
			"amountMax":           "1000",
			"description":         "lorem",
			"typeTransactionName": typeTransactionName,
			"categoryID":          categoryID,
			"page":                fmt.Sprintf("%d", page),
			"pageSize":            fmt.Sprintf("%d", pageSize),
			"createdAtFrom":       today.Format(timeLayout),
			"createdAtTo":         tomorow.Format(timeLayout),
		}

		e2e.FindTransactionsWithQueries(t, token, queryParams, 5, 2, 10, page)
	}
}
