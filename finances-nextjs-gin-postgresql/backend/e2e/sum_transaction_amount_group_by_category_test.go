package e2e_test

import (
	"api/e2e"
	"math/rand"
	"testing"
	"time"
)

func randRange(min, max int) int {
	return rand.Intn(max-min) + min
}

func TestSumTrasactionAmountGroupByCategory(
	t *testing.T,
) {
	e2e.DeleteData(t)

	var (
		token = e2e.BeforeAuthAnyPrivate(t, "Robin Silvano", "robin@email.com", "12345678")

		timeLayout = "2006-01-02"
		today      = time.Now()
		tomorow    = today.Add(time.Hour * 24)

		typeTransactionName string
		description         = "lorem lorem lorem lorem lorem"

		cs                 = e2e.FindCategories(t, token)
		tts                = e2e.FindTypeTransactions(t, token)
		amountTransactions = 50
	)

	for i := 0; i < amountTransactions; i++ {
		index := randRange(0, len(cs))
		categoryID := cs[index].ID
		typeTransactionName = tts[0].Name
		amount := rand.Float64()
		e2e.InsertTransaction(t, token, categoryID, typeTransactionName, description, amount)
	}

	queryParams := map[string]string{
		"typeTransactionName": typeTransactionName,
		"createdAtFrom":       today.Format(timeLayout),
		"createdAtTo":         tomorow.Format(timeLayout),
	}

	e2e.SumTransactionAmountGroupByCategory(t, token, queryParams)
}
