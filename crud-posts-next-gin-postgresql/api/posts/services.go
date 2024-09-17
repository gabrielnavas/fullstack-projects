package posts

import (
	"api/users"
	"errors"
	"time"

	"github.com/google/uuid"
)

type PostService struct {
	postRepository *PostRepository
	userRepository *users.UserRepository
}

func NewPostService(pRepo *PostRepository, uRepo *users.UserRepository) *PostService {
	return &PostService{pRepo, uRepo}
}

type PostInsert struct {
	Description string
	UserId      string
}

func (s *PostService) InsertPost(params PostInsert) (*Post, error) {
	userFound, err := s.userRepository.FindUserById(params.UserId)
	if err != nil {
		return nil, errors.New("user not found")
	}

	var post Post = Post{
		ID:          uuid.NewString(),
		Description: params.Description,
		Views:       []View{},
		ViewsCount:  0,
		Likes:       []Like{},
		LikesCount:  0,
		CreatedAt:   time.Now(),
		Owner:       userFound,
	}
	err = post.Validate()
	if err != nil {
		return nil, err
	}

	err = s.postRepository.InsertPost(&post)
	return &post, err
}

func (s *PostService) FindPosts(page, size int64, query string) ([]*Post, error) {
	posts, err := s.postRepository.FindPosts(page, size, query)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}

	return posts, err
}
