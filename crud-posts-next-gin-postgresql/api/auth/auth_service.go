package auth

import (
	"api/shared"
	"api/token"
	"api/users"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	jwtSecretKey   string
	jwtHoursExpire int64
	userRepository *users.UserRepository
	tokenService   *token.TokenService
}

type SignIn struct {
	Username string
	Password string
}

func NewAuthService(
	jwtSecretKey string,
	jwtHoursExpire int64,
	userRepository *users.UserRepository,
	tokenService *token.TokenService,
) *AuthService {
	return &AuthService{
		jwtSecretKey,
		jwtHoursExpire,
		userRepository,
		tokenService,
	}
}

func (s *AuthService) Signin(params SignIn) (*SigninDto, error) {

	user, err := s.userRepository.FindUserByUsername(params.Username)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}
	if user == nil {
		return nil, errors.New("e-mail/password incorrect")
	}

	auth := &Auth{
		Username: shared.Username{Value: user.Username},
		Password: shared.Password{Value: params.Password},
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(auth.Password.Value))
	if err != nil {
		return nil, errors.New("e-mail/password incorrect")
	}
	auth.Password.Value = user.PasswordHash

	tokenStr, err := s.tokenService.NewTokenString(user.ID)
	if err != nil {
		return nil, err
	}
	auth.Token = tokenStr

	err = auth.Validate()
	if err != nil {
		return nil, err
	}

	return &SigninDto{
		Username: auth.Username.Value,
		Token:    auth.Token,
	}, nil
}
