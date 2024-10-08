package e2e

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

type TypeTransaction struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func FindTypeTransactions(t *testing.T, token string) []TypeTransaction {
	client := &http.Client{Timeout: 10 * time.Second} // timeout opcional para evitar testes demorados
	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf("%s/type-transactions", serverEndPoint),
		nil,
	)
	assert.Nil(t, err, "expected error nil")

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	assert.Nil(t, err)
	assert.NotNil(t, resp)
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusOK)

	var responseBody struct {
		Data    []TypeTransaction
		Message string `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	assert.True(t, len(responseBody.Data) == 2)

	return responseBody.Data
}
