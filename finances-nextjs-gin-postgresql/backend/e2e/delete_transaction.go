package e2e

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func DeleteTransaction(t *testing.T, token string, tID string) {
	client := &http.Client{Timeout: 10 * time.Second}
	var url string = fmt.Sprintf("%s/transactions/%s", serverEndPoint, tID)
	req, err := http.NewRequest(
		"DELETE",
		url,
		nil,
	)
	assert.Nil(t, err, "expected error nil")

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	assert.Nil(t, err, "expected error nil")
	assert.NotNil(t, resp, "expected resp")
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusNoContent)
}
