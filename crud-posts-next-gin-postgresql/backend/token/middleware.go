package token

import (
	"api/shared"
	"api/users"
	"context"
	"encoding/json"
	"net/http"
)

type TokenHttpMiddleware struct {
	tokenService *TokenService
	userService  *users.UserService
}

func NewTokenHttpMiddleware(
	tokenService *TokenService,
	userService *users.UserService,
) *TokenHttpMiddleware {
	return &TokenHttpMiddleware{
		tokenService,
		userService,
	}
}

func (m *TokenHttpMiddleware) CheckAutorizationHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var authorization = r.Header.Get("Authorization")
		if authorization == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponseBody{
				Message: "missing Bearer Authorization Token on header",
			})
			return
		}
		bearerLenght := len("Bearer ")
		token := authorization[bearerLenght:]
		if token == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponseBody{
				Message: "missing Bearer Authorization Token on header",
			})
		}
		var userId, err = m.tokenService.ExtractUserIdFromToken(token)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponseBody{
				Message: "missing Bearer Authorization Token on header",
			})
			return
		}

		userFound, err := m.userService.FindUserById(userId)
		if err != nil || userFound == nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponseBody{
				Message: "missing Bearer Authorization Token on header",
			})
			return
		}

		ctx := context.WithValue(r.Context(), "userId", userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
