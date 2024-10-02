package e2e

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func SignUp(t *testing.T, fullname, username, password string) (statusCode int) {
	reqBody := map[string]interface{}{
		"fullName": fullname,
		"email":    username,
		"password": password,
	}
	reqBodyJson, _ := json.Marshal(reqBody)

	// Enviar uma requisição real para o servidor rodando
	client := &http.Client{Timeout: 10 * time.Second} // timeout opcional para evitar testes demorados
	req, err := http.NewRequest(
		"POST",
		"http://localhost:3001/api/auth/signup",
		bytes.NewBuffer(reqBodyJson),
	)
	assert.Nil(t, err, "error on create request signup")

	// Adicionar cabeçalhos, como o token de autenticação ou outros
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	assert.Nil(t, err, "error on http request signup")
	defer resp.Body.Close()

	// Verificar o status code
	assert.Equal(t, resp.StatusCode, http.StatusCreated)

	statusCode = resp.StatusCode
	return
}
