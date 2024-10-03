package e2e_test

import (
	"api/e2e"
	"api/transactions"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUpdateTransactionTest(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(
		t,
		"Shrek da Silva",
		"shrek@email.com",
		"12345678",
	)
	cs := e2e.FindCategories(t, token)
	tts := e2e.FindTypeTransactions(t, token)

	typeTransaction := tts[0]
	category := cs[0]

	e2e.InsertTransaction(t, token, category.ID, typeTransaction.Name, "lorem lorem lorem lorem lorem", 50.95)
	ts := e2e.FindTransactions(t, token)

	tts = e2e.FindTypeTransactions(t, token)
	transaction := ts[0]

	cs = e2e.FindCategories(t, token)

	updateParams := &transactions.UpdateTransactionParams{
		Amount:            250.59,
		TypeTransactionID: tts[1].ID,
		CategoryID:        cs[1].ID,
		Description:       "Agora vai!",
	}

	e2e.UpdatePartialsTransaction(t, token, transaction.ID, updateParams)

	ts = e2e.FindTransactions(t, token)
	transaction = ts[0]
	assert.NotNil(t, transaction.UpdatedAt)
}
