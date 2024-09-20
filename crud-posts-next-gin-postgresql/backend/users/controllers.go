package users

import (
	"api/shared"
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

func (c *UserController) FindUserById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "invalid user param ID",
		})
		return
	}

	user, err := c.userService.FindUserById(userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "error! call the admin",
		})
		return
	}
	if user == nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "user not found",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Message: "",
		Data:    user,
	})
}
