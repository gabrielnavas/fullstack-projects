package auth

import (
	"api/shared"
	"api/users"
	"encoding/json"
	"net/http"
)

type AuthController struct {
	authService *AuthService
	userService *users.UserService
}

func NewAuthController(
	authService *AuthService,
	userService *users.UserService,
) *AuthController {
	return &AuthController{authService, userService}
}

func (c *AuthController) SignIn(w http.ResponseWriter, r *http.Request) {
	var signIn SignIn
	err := json.NewDecoder(r.Body).Decode(&signIn)
	if err != nil {
		http.Error(w, "missing params username and password", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "missing params username and password",
		})
		return
	}

	auth, err := c.authService.Signin(signIn)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: err.Error(),
			Data:    auth,
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Message: "",
		Data:    auth,
	})
}

func (c *AuthController) SignUp(w http.ResponseWriter, r *http.Request) {
	var userInsert users.UserInsert
	err := json.NewDecoder(r.Body).Decode(&userInsert)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "invalid body",
		})
	}

	user, err := c.userService.InsertUser(userInsert)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "error! call the admin",
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Message: "",
		Data:    user,
	})
}
