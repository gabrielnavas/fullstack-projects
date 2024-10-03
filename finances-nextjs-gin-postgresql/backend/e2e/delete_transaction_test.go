package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestDeleteTransactionTest(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "Mary Jaine", "mary@email.com", "12345678")
	cs := e2e.FindCategories(t, token)
	tts := e2e.FindTypeTransactions(t, token)

	typeTransaction := tts[0]
	category := cs[0]

	e2e.InsertTransaction(t, token, category.ID, typeTransaction.Name, "lorem lorem lorem lorem lorem", 50.95)
	ts := e2e.FindTransactions(t, token)

	tr := ts[0]

	e2e.DeleteTransaction(t, token, tr.ID)
}
