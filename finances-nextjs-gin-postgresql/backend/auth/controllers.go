package auth

import (
	"api/shared"
	"api/users"
	"encoding/json"
	"errors"
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

type SignUpRequest struct {
	FullName string `json:"fullname"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *SignUpRequest) Valid() error {
	// generic verification
	if len(s.FullName) > 255 {
		return errors.New("nome completo está muito longo")
	}
	if len(s.Email) > 255 {
		return errors.New("e-mail está muito longo")
	}
	if len(s.Password) > 255 {
		return errors.New("senha está muito longa")
	}
	return nil
}

func (c *AuthController) SignUp(w http.ResponseWriter, r *http.Request) {
	var body SignUpRequest
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

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *SignInRequest) Valid() error {
	// generic verification
	if len(s.Email) > 255 {
		return errors.New("e-mail está muito longo")
	}
	if len(s.Password) > 255 {
		return errors.New("senha está muito longo")
	}
	return nil
}

func (c *AuthController) SignIn(w http.ResponseWriter, r *http.Request) {
	var body SignInRequest
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
