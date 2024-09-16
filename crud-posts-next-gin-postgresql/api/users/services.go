package users

import (
	"errors"
	"fmt"
	"math/rand/v2"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type InsertUser struct {
	Username string
}

type UserService struct {
	repo *UserRepository
}

func NewUserService(repo *UserRepository) *UserService {
	return &UserService{repo}
}

func (s *UserService) generateRandomHashPassword(length int64) string {
	randomPassword := ""

	var i int64 = 0
	for i < length {
		randomPassword += fmt.Sprintf("%d", rand.IntN(9))
		i++
	}

	bcryptPassword, _ := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
	passwordHash := string(bcryptPassword)

	return passwordHash
}

func (s *UserService) InsertUser(params InsertUser) (*User, error) {

	var user *User = &User{
		ID:           uuid.NewString(),
		Username:     params.Username,
		PasswordHash: s.generateRandomHashPassword(6),
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
