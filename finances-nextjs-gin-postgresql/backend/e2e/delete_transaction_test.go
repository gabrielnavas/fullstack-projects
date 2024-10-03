package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestDeleteTransactionTest(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "Mary Jaine", "mary@email.com", "12345678")
	e2e.InsertTransaction(t, token)
	ts := e2e.FindTransactions(t, token)

	tr := ts[0]

	e2e.DeleteTransaction(t, token, tr.ID)
}
