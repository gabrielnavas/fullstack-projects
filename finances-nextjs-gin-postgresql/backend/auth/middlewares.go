package auth

import (
	"api/shared"
	"api/tokens"
	"api/users"
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
)

type AuthMiddleware struct {
	tokenService *tokens.TokenService
	userService  *users.UserService
}

func NewAuthMiddleware(
	tokenService *tokens.TokenService,
	userService *users.UserService,
) *AuthMiddleware {
	return &AuthMiddleware{
		tokenService,
		userService,
	}
}

func (m *AuthMiddleware) AutorizationTokenBearerHeader(next http.Handler) http.Handler {
	var getAuthorizationHeader = func(r *http.Request) (authorization string, err error) {
		authorization = r.Header.Get("Authorization")
		if authorization == "" {
			log.Println("missing Bearer Authorization Token on header")
			return "", errors.New("sua sessão expirou")
		}
		return
	}

	var getBearerToken = func(authorizationBearer string) (string, error) {
		bearerLenght := len("Bearer ")
		token := authorizationBearer[bearerLenght:]
		if token == "" {
			log.Println("missing Bearer Authorization Token on header")
			return "", errors.New("sua sessão expirou")
		}
		return token, nil
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization, err := getAuthorizationHeader(r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: err.Error(),
			})
			return
		}

		token, err := getBearerToken(authorization)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: err.Error(),
			})
			return
		}

		userId, err := m.tokenService.ExtractUserIdFromToken(token)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			log.Println(err.Error())
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "sua sessão expirou",
			})
			return
		}

		userFound, err := m.userService.FindUserById(userId)
		if err != nil || userFound == nil {
			w.WriteHeader(http.StatusUnauthorized)
			log.Println(err.Error())
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: "sua sessão expirou",
			})
			return
		}

		ctx := context.WithValue(r.Context(), shared.USER_ID_KEY_CONTEXT, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
