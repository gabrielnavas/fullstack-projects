package tokens

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
)

type TokenService struct {
	jwtSecretKey         string
	jwtExpirationSeconds int64
}

func NewTokenService(
	jwtSecretKey string,
	jwtExpirationSeconds int64,
) *TokenService {
	return &TokenService{jwtSecretKey, jwtExpirationSeconds}
}

func (s *TokenService) GenerateToken(userId string) (string, error) {
	now := time.Now()
	claims := jwt.MapClaims{
		// (Issued At): Indica o momento em que o token foi gerado. Esse campo é útil para verificar quando o token
		// foi emitido, o que pode ajudar a validar se o token ainda está dentro de seu tempo de validade.
		"iat": now.Unix(),

		// Define o momento em que o token expira. Após essa data/hora, o
		// token não será mais considerado válido, e o servidor deve rejeitá-lo.
		// O valor é um timestamp (número de segundos desde 01/01/1970, o famoso Unix epoch).
		"exp": now.Add(time.Duration(s.jwtExpirationSeconds) * time.Second).Unix(),

		// (Not Before): Define a partir de que momento o token passa a ser válido. Antes
		// do timestamp especificado em nbf, o token será considerado inválido.
		"nbf": now.Unix(),

		// (Subject) custom data
		// sub usado para identificar o dono do usuário
		"sub": userId,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtStr, err := token.SignedString([]byte(s.jwtSecretKey))
	if err != nil {
		return "", errors.New("error on create token jwt")
	}
	return jwtStr, nil
}

func (s *TokenService) isJwtTokenValid(tokenJwt string) (jwt.MapClaims, error) {
	token, err := jwt.ParseWithClaims(tokenJwt, jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecretKey), nil
	})
	if err != nil {
		return nil, errors.New("jwt token is invalid")
	}

	claims := token.Claims.(jwt.MapClaims)
	err = claims.Valid()
	if err != nil {
		return nil, errors.New("jwt token is invalid")
	}

	return claims, nil
}

func (s *TokenService) ExtractUserIdFromToken(tokenJwt string) (string, error) {
	claims, err := s.isJwtTokenValid(tokenJwt)
	if err != nil {
		return "", errors.New("jwt token is invalid")
	}

	if sub, ok := claims["sub"].(string); ok {
		return sub, nil
	}
	return "", errors.New("user id not found")
}
