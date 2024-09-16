package users

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
)

type UserController struct {
	userService *UserService
}

func NewUserController(us *UserService) *UserController {
	return &UserController{us}
}

func (c *UserController) InsertUser(w http.ResponseWriter, r *http.Request) {
	var userInsert InsertUser
	err := json.NewDecoder(r.Body).Decode(&userInsert)
	if err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
	}

	user, err := c.userService.InsertUser(userInsert)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (c *UserController) FindUserById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		http.Error(w, "invalid user param ID", http.StatusBadRequest)
		return
	}

	user, err := c.userService.FindUserById(userId)
	if err != nil {
		http.Error(w, "error! call the admin", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
