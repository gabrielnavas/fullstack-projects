package token

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenService struct {
	jwtSecretKey   string
	jwtHoursExpire int64
}

func NewTokenService(
	jwtSecretKey string,
	jwtHoursExpire int64,
) *TokenService {
	return &TokenService{jwtSecretKey, jwtHoursExpire}
}

func (s *TokenService) NewTokenString(userId string) (string, error) {
	claims := s.newClaims(userId)
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)
	tokenStr, err := token.SignedString([]byte(s.jwtSecretKey))
	return tokenStr, err
}

func (s *TokenService) newClaims(userId string) jwt.MapClaims {
	now := time.Now()
	return jwt.MapClaims{
		"sub": userId,
		"iat": now.Unix(),
		"exp": now.Add(time.Hour * time.Duration(s.jwtHoursExpire)).Unix(),
	}
}

func (s *TokenService) extractToken(jwtToken string) (jwt.MapClaims, *jwt.Token, error) {
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(jwtToken, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecretKey), nil
	})
	return token.Claims.(jwt.MapClaims), token, err
}

func (s *TokenService) ExtractUserIdFromToken(jwtToken string) (string, error) {
	claims, token, err := s.extractToken(jwtToken)
	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", errors.New("token invalid")
	}

	if sub, ok := claims["sub"].(string); ok {
		return sub, nil
	}
	return "", errors.New("user id not found")
}
