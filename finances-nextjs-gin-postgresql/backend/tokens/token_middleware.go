package tokens

import (
	"api/shared"
	"api/users"
	"context"
	"encoding/json"
	"net/http"
)

type TokenJwtMiddleware struct {
	tokenService *TokenService
	userService  *users.UserService
}

func NewTokenJwtMiddleware(
	tokenService *TokenService,
	userService *users.UserService,
) *TokenJwtMiddleware {
	return &TokenJwtMiddleware{
		tokenService,
		userService,
	}
}

const bearerLenght = len("Bearer ")

func (m *TokenJwtMiddleware) CheckAutorizationHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var authorization = r.Header.Get("Authorization")
		if authorization == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "missing Bearer Authorization Token on header",
			})
			return
		}
		token := authorization[bearerLenght:]
		if token == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "missing Bearer Authorization Token on header",
			})
		}
		var userId, err = m.tokenService.ExtractUserIdFromToken(token)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "missing Bearer Authorization Token on header",
			})
			return
		}

		userFound, err := m.userService.FindUserById(userId)
		if err != nil || userFound == nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "missing Bearer Authorization Token on header",
			})
			return
		}

		ctx := context.WithValue(r.Context(), shared.USER_ID_KEY_CONTEXT, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
