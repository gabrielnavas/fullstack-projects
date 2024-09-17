package auth

import (
	"api/users"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	jwtSecretKey   string
	jwtHoursExpire int64
	userRepository *users.UserRepository
}

type SignIn struct {
	Username string
	Password string
}

func NewAuthService(
	jwtSecretKey string,
	jwtHoursExpire int64,
	userRepository *users.UserRepository,
) *AuthService {
	return &AuthService{jwtSecretKey, jwtHoursExpire, userRepository}
}

func (s *AuthService) Signin(params SignIn) (*Auth, error) {
	user, err := s.userRepository.FindUserByUsername(params.Username)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}
	if user == nil {
		return nil, errors.New("e-mail/password incorrect")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(params.Password))
	if err != nil {
		return nil, errors.New("e-mail/password incorrect")
	}

	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username ": user.Username,
		"iat":       now.Unix(),
		"exp":       now.Add(time.Hour * time.Duration(s.jwtHoursExpire)).Unix(),
	})
	tokenStr, err := token.SignedString([]byte(s.jwtSecretKey))
	if err != nil {
		return nil, errors.New("error! call the admin")
	}

	return &Auth{
		Username:  user.Username,
		Password:  user.PasswordHash,
		Token:     tokenStr,
		CreatedAt: time.Now(),
	}, nil
}
