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
	repo *UserRepository
}

func NewUserService(repo *UserRepository) *UserService {
	return &UserService{repo}
}

func (s *UserService) InsertUser(params UserInsert) (*User, error) {
	bcryptPassword, _ := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)

	var user *User = &User{
		ID:           uuid.NewString(),
		Username:     params.Username,
		PasswordHash: string(bcryptPassword),
		CreatedAt:    time.Now(),
	}
	err := s.repo.InsertUser(user)
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	return user, nil
}

func (s *UserService) FindUserById(userId string) (*User, error) {
	user, err := s.repo.FindUserById(userId)
	if err != nil {
		return nil, errors.New("contact the admin")
	}
	return user, err
}
