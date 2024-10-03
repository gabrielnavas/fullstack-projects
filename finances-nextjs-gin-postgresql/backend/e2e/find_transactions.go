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

func FindTransactionsWithQueries(
	t *testing.T,
	token string,
	queryParams map[string]string,
	expectedTransactionsLen int,
) []transactions.Transaction {
	client := &http.Client{Timeout: 10 * time.Second}

	url := fmt.Sprintf("%s/transactions", serverEndPoint)

	// add queries to url
	queries := []string{}
	for key, value := range queryParams {
		query := fmt.Sprintf("%s=%s", key, value)
		queries = append(queries, query)
	}
	if len(queries) > 0 {
		url = url + "?"
		for _, query := range queries {
			url += query + "&"
		}
	}

	req, err := http.NewRequest("GET", url, nil)
	assert.Nil(t, err, "expected error nil")

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	assert.Nil(t, err)
	assert.NotNil(t, resp)
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusOK)

	var responseBody struct {
		Data    []transactions.Transaction
		Message string `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	// Validar o body da response
	assert.Len(t, responseBody.Data, expectedTransactionsLen)

	return responseBody.Data
}
