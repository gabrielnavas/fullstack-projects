package e2e

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func SignIn(t *testing.T, email, password string) (statusCode int, token string) {
	reqBody := map[string]interface{}{
		"email":    email,
		"password": password,
	}
	reqBodyJson, _ := json.Marshal(reqBody)

	// Enviar uma requisição real para o servidor rodando
	client := &http.Client{Timeout: 10 * time.Second} // timeout opcional para evitar testes demorados
	req, err := http.NewRequest(
		"POST",
		fmt.Sprintf("%s/auth/signin", serverEndPoint),
		bytes.NewBuffer(reqBodyJson),
	)
	assert.Nil(t, err, "expected error nil")

	// Adicionar cabeçalhos, como o token de autenticação ou outros
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	assert.Nil(t, err)
	assert.NotNil(t, resp)
	defer resp.Body.Close()

	// Verificar o status code
	assert.Equal(t, resp.StatusCode, http.StatusCreated)
	statusCode = resp.StatusCode

	// Verificar o corpo da resposta
	var responseBody struct {
		Data    string `json:"data"`
		Message string `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Nil(t, err, "expected nil")

	// Validar os dados retornados
	token = responseBody.Data
	assert.True(t, len(token) > 50, "token is not greater than 50")

	return
}
