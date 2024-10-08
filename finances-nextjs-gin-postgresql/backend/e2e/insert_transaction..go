package e2e

import (
	"api/transactions"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func InsertTransaction(t *testing.T, token string, categoryID, typeTransactioName, description string, amount float64) {
	reqBody := transactions.InsertTransactionParams{
		Amount:              amount,
		TypeTransactionName: typeTransactioName,
		CategoryID:          categoryID,
		Description:         description,
	}
	reqBodyJson, _ := json.Marshal(reqBody)

	// Enviar uma requisição real para o servidor rodando
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest(
		"POST",
		fmt.Sprintf("%s/transactions", serverEndPoint),
		bytes.NewBuffer(reqBodyJson),
	)
	assert.Nil(t, err, "expected error nil")

	// Adicionar cabeçalhos, como o token de autenticação ou outros
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	assert.Nil(t, err, "expected error nil")
	assert.NotNil(t, resp, "expected resp")
	defer resp.Body.Close()

	// Verificar o status code
	assert.Equal(t, resp.StatusCode, http.StatusCreated)

	// Verificar o corpo da resposta
	var responseBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected error nil")

	// Validar os dados retornados
	assert.Equal(t, "transação realizada", responseBody["message"])
}
