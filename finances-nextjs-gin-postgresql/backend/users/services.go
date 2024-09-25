package users

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepository *UserRepository
}

func NewUserService(userRepository *UserRepository) *UserService {
	return &UserService{userRepository}
}

type CreateUserParams struct {
	FullName string
	Email    string
	Password string
}

func (s *CreateUserParams) Valid() error {
	// generic verification
	if len(s.FullName) > 255 {
		return errors.New("nome completo está muito longo")
	}
	if len(s.Email) > 255 {
		return errors.New("e-mail está muito longo")
	}
	if len(s.Password) > 255 {
		return errors.New("senha está muito longa")
	}
	return nil
}

func (s *UserService) CreateUser(userParams *CreateUserParams) (*User, error) {
	err := userParams.Valid()
	if err != nil {
		return nil, err
	}

	user := User{
		ID:           uuid.NewString(),
		FullName:     userParams.FullName,
		Email:        userParams.Email,
		PasswordHash: userParams.Password,
		CreatedAt:    time.Now(),
	}
	err = user.Valid()
	if err != nil {
		return nil, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword(
		[]byte(userParams.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, errors.New("error on generate hash password")
	}
	user.PasswordHash = string(passwordHash)

	userData := UserData{
		ID:           uuid.NewString(),
		FullName:     userParams.FullName,
		Email:        userParams.Email,
		PasswordHash: string(passwordHash),
		CreatedAt:    time.Now(),
	}
	err = s.userRepository.InsertUser(&userData)
	if err != nil {
		return nil, errors.New("error on insert user repository")
	}

	return mapDataToModel(&userData), nil

}

func (s *UserService) FindUserById(userId string) (*User, error) {
	userData, err := s.userRepository.FindUserById(userId)
	if err != nil {
		return nil, errors.New("error on find user by id")
	}
	if userData == nil {
		return nil, errors.New("user not found")
	}

	return mapDataToModel(userData), nil
}

func (s *UserService) FindUserByEmail(userId string) (*User, error) {
	userData, err := s.userRepository.FindUserByEmail(userId)
	if err != nil {
		return nil, errors.New("error on find user by email")
	}
	if userData == nil {
		return nil, errors.New("user not found")
	}

	return mapDataToModel(userData), nil
}

func mapDataToModel(u *UserData) *User {
	return &User{
		ID:           u.ID,
		FullName:     u.FullName,
		Email:        u.Email,
		PasswordHash: u.PasswordHash,
		CreatedAt:    u.CreatedAt,
	}
}
