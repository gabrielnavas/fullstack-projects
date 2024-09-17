package auth

import (
	"encoding/json"
	"net/http"
)

type AuthController struct {
	authService *AuthService
}

func NewAuthController(authService *AuthService) *AuthController {
	return &AuthController{authService}
}

func (c *AuthController) SignIn(w http.ResponseWriter, r *http.Request) {
	var signIn SignIn
	err := json.NewDecoder(r.Body).Decode(&signIn)
	if err != nil {
		http.Error(w, "missing params username and password", http.StatusBadRequest)
		return
	}

	auth, err := c.authService.Signin(signIn)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(auth)
}
