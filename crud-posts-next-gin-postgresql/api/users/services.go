package users

import (
	"api/shared"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserInsert struct {
	Username string
	Password string
}

type UserService struct {
	userRepo *UserRepository
}

func NewUserService(userRepo *UserRepository) *UserService {
	return &UserService{userRepo}
}

func (s *UserService) InsertUser(params UserInsert) (*User, error) {
	userByUsername, err := s.userRepo.FindUserByUsername(params.Username)
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	if userByUsername != nil {
		return nil, errors.New("user already exists with username")
	}

	var user *User = &User{
		ID:        uuid.NewString(),
		Username:  shared.Username{Value: params.Username},
		Password:  shared.Password{Value: params.Password},
		CreatedAt: time.Now(),
	}
	err = user.Validate()
	if err != nil {
		return nil, err
	}

	bcryptPassword, _ := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	user.Password.Value = string(bcryptPassword)

	err = s.userRepo.InsertUser(&UserData{
		ID:           user.ID,
		Username:     user.Username.Value,
		PasswordHash: user.Password.Value,
		CreatedAt:    time.Now(),
		UpdatedAt:    nil,
		DeletedAt:    nil,
	})
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	return user, nil
}

func (s *UserService) FindUserById(userId string) (*UserDto, error) {
	user, err := s.userRepo.FindUserById(userId)
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	return &UserDto{
		ID:        user.ID,
		Username:  user.Username,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, err
}
