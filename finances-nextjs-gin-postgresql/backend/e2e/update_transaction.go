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

func UpdatePartialsTransaction(t *testing.T, token string, tID string, tr *transactions.UpdateTransactionParams) {
	reqBodyJson, _ := json.Marshal(tr)

	client := &http.Client{Timeout: 10 * time.Second}
	var url string = fmt.Sprintf("%s/transactions/%s", serverEndPoint, tID)
	req, err := http.NewRequest(
		"PATCH",
		url,
		bytes.NewBuffer(reqBodyJson),
	)
	assert.Nil(t, err, "expected error nil")

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	assert.Nil(t, err, "expected error nil")
	assert.NotNil(t, resp, "expected resp")
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusNoContent)
}
