package users

import (
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

	bcryptPassword, _ := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)

	var user *User = &User{
		ID:           uuid.NewString(),
		Username:     params.Username,
		PasswordHash: string(bcryptPassword),
		CreatedAt:    time.Now(),
	}
	err = s.userRepo.InsertUser(user)
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	return user, nil
}

func (s *UserService) FindUserById(userId string) (*User, error) {
	user, err := s.userRepo.FindUserById(userId)
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	return user, err
}
