package auth

import (
	"api/tokens"
	"api/users"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	tokenService *tokens.TokenService
	userService  *users.UserService
}

func NewAuthService(
	tokenService *tokens.TokenService,
	userService *users.UserService,
) *AuthService {
	return &AuthService{tokenService, userService}
}

type SignInParams struct {
	Email    string
	Password string
}

func (s *SignInParams) Valid() error {
	// generic verification
	if len(s.Email) > 255 {
		return errors.New("e-mail está muito longo")
	}
	if len(s.Password) > 255 {
		return errors.New("senha está muito longo")
	}
	return nil
}

func (s *AuthService) SignIn(SignInParams *SignInParams) (string, error) {
	err := SignInParams.Valid()
	if err != nil {
		return "", err
	}

	user, err := s.userService.FindUserByEmail(SignInParams.Email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("e-mail e/ou incorretos")
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(SignInParams.Password)); err != nil {
		return "", errors.New("e-mail e/ou incorretos")
	}

	token, err := s.tokenService.GenerateToken(user.ID)
	if err != nil {
		return "", err
	}
	return token, nil
}
