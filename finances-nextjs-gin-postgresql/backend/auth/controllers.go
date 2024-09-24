package auth

import (
	"api/users"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	userRepository *users.UserRepository
}

func NewAuthController(ur *users.UserRepository) *AuthController {
	return &AuthController{userRepository: ur}
}

type SignUpRequest struct {
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type HttpResponse struct {
	Message string `message:"message"`
}

func (c *AuthController) SignUp(w http.ResponseWriter, r *http.Request) {
	var body SignUpRequest
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Printf("error on decode body signup\n")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(HttpResponse{
			Message: "error! call the admin",
		})
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("error on generate password\n")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(HttpResponse{
			Message: "error! call the admin",
		})
		return
	}

	userData := users.UserData{
		ID:           uuid.NewString(),
		Fullname:     body.Fullname,
		Email:        body.Email,
		PasswordHash: string(passwordHash),
		CreatedAt:    time.Now(),
	}
	err = c.userRepository.InsertUser(&userData)
	if err != nil {
		log.Printf("error on insert user repository\n")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(HttpResponse{
			Message: "error! call the admin",
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(HttpResponse{
		Message: "conta criada",
	})
}
