package posts

import (
	"api/shared"
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

func (s *PostService) InsertPost(userId string, params PostInsertDto) (*PostDto, error) {
	userData, err := s.userRepository.FindUserById(userId)
	if err != nil {
		return nil, errors.New("erro! call the admin")
	}
	if userData == nil {
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
		Owner: users.User{
			ID:        userData.ID,
			Username:  shared.Username{Value: userData.Username},
			Password:  shared.Password{Value: userData.PasswordHash},
			CreatedAt: userData.CreatedAt,
			UpdatedAt: userData.UpdatedAt,
		},
	}
	err = post.Validate()
	if err != nil {
		return nil, err
	}

	err = s.postRepository.InsertPost(&PostData{
		ID:          post.ID,
		Description: params.Description,
		ViewsCount:  0,
		LikesCount:  0,
		CreatedAt:   time.Now(),
		UpdatedAt:   nil,
		OwnerID:     userData.ID,
	})

	return &PostDto{
		ID:          post.ID,
		Description: post.Description,
		ViewsCount:  post.ViewsCount,
		LikesCount:  post.LikesCount,
		CreatedAt:   post.CreatedAt,
		UpdatedAt:   post.UpdatedAt,
		OwnerID:     userData.ID,
	}, err
}

func (s *PostService) FindPosts(page, size int64, query string) ([]*PostDto, error) {
	postsData, err := s.postRepository.FindPosts(page, size, query)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}

	var postDtos = []*PostDto{}

	for _, postData := range postsData {
		postDtos = append(postDtos, &PostDto{
			ID:          postData.ID,
			Description: postData.Description,
			ViewsCount:  postData.ViewsCount,
			LikesCount:  postData.LikesCount,
			CreatedAt:   postData.CreatedAt,
			UpdatedAt:   postData.UpdatedAt,
			OwnerID:     postData.OwnerID,
		})
	}

	return postDtos, nil
}
