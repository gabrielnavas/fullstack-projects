package e2e_test

import (
	"api/e2e"
	"testing"
)

func TestInsertTransaction(t *testing.T) {
	e2e.DeleteData(t)
	token := e2e.BeforeAuthAnyPrivate(t, "batman da silva", "batman@email.com", "12345678")
	cs := e2e.FindCategories(t, token)
	tts := e2e.FindTypeTransactions(t, token)

	typeTransaction := tts[0]
	category := cs[0]

	e2e.InsertTransaction(t, token, category.ID, typeTransaction.Name, "lorem lorem lorem lorem lorem", 50.95)
}
