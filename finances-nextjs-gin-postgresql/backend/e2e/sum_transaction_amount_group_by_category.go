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

func SumTransactionAmountGroupByCategory(
	t *testing.T,
	token string,
	queryParams map[string]string,
) {

	url := fmt.Sprintf("%s/transactions/analytics/sumAmountGroupByCategory", serverEndPoint)
	url = MapQueriesToUrl(url, queryParams)

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest(
		"GET",
		url,
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
		Data []transactions.SumAmountGroupByCategoryResult `json:"data"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	assert.NotNil(t, responseBody.Data)
	assert.True(t, len(responseBody.Data) > 0)
}
