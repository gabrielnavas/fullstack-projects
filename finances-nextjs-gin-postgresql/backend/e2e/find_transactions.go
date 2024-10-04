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

func FindTransactions(t *testing.T, token string) transactions.FindTransactionsResult {
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
		Data    transactions.FindTransactionsResult `json:"data"`
		Message string                              `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	assert.NotNil(t, responseBody.Data.Transactions)
	assert.True(t, len(responseBody.Data.Transactions) == 1)
	assert.True(t, responseBody.Data.TotalPages == 1)
	assert.True(t, responseBody.Data.TotalItems == 1)
	assert.True(t, responseBody.Data.CurrentPage == 0)

	return responseBody.Data
}

func FindTransactionsWithQueries(
	t *testing.T,
	token string,
	queryParams map[string]string,
	expectedTotalTransactions int,
	expectedTotalPages int,
	expectedTotalItems int,
	expectedCurrentPage int,
) *transactions.FindTransactionsResult {
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
		Data    transactions.FindTransactionsResult
		Message string `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	// Validar o body da response
	assert.NotNil(t, responseBody.Data.Transactions)
	assert.Len(t, responseBody.Data.Transactions, expectedTotalTransactions)
	assert.Equal(t, responseBody.Data.TotalPages, expectedTotalPages)
	assert.Equal(t, expectedTotalItems, responseBody.Data.TotalItems)
	assert.Equal(t, expectedCurrentPage, responseBody.Data.CurrentPage)

	return &responseBody.Data
}
