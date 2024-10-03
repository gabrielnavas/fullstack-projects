package e2e

import (
	"api/transactions"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func FindTransactions(t *testing.T, token string) []*transactions.Transaction {
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf("%s/transactions", serverEndPoint),
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
		Data    []*transactions.Transaction
		Message string `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	assert.True(t, len(responseBody.Data) == 1)

	return responseBody.Data
}
