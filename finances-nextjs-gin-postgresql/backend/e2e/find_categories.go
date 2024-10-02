package e2e

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func FindCategories(t *testing.T, token string) []Category {
	client := &http.Client{Timeout: 10 * time.Second}

	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf("%s/categories", serverEndPoint),
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
		Data    []Category
		Message string `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	// Validar o body da response
	assert.True(t, len(responseBody.Data) == 20)

	return responseBody.Data
}
