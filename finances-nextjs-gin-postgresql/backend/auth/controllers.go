package auth

import (
	"api/shared"
	"api/users"
	"encoding/json"
	"log"
	"net/http"
)

type AuthController struct {
	userService *users.UserService
	authService *AuthService
}

func NewAuthController(
	userService *users.UserService,
	authService *AuthService,
) *AuthController {
	return &AuthController{userService, authService}
}

func (c *AuthController) SignUp(w http.ResponseWriter, r *http.Request) {
	var body users.CreateUserParams
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Printf("error on decode body signup\n")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "error! call the admin",
		})
		return
	} else {
		if err := body.Valid(); err != nil {
			log.Printf("error on decode body signup\n")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "error! call the admin",
			})
			return
		}
	}

	_, err = c.userService.CreateUser(&users.CreateUserParams{
		FullName: body.FullName,
		Email:    body.Email,
		Password: body.Password,
	})
	if err != nil {
		log.Printf("%s", err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Message: "conta criada",
	})
}

func (c *AuthController) SignIn(w http.ResponseWriter, r *http.Request) {
	var body SignInParams
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Printf("error on decode body signup\n")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "error! call the admin",
		})
		return
	} else {
		if err := body.Valid(); err != nil {
			log.Printf("error on decode body signup\n")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "error! call the admin",
			})
			return
		}
	}

	tokenJwt, err := c.authService.SignIn(&SignInParams{
		Email:    body.Email,
		Password: body.Password,
	})
	if err != nil {
		log.Printf("error signin\n")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Message: "conta criada",
		Data:    tokenJwt,
	})
}
