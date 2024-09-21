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

	now := time.Now()
	truncatedNow := now.Truncate(time.Millisecond)

	err = s.postRepository.InsertPost(&PostData{
		ID:          post.ID,
		Description: params.Description,
		ViewsCount:  0,
		LikesCount:  0,
		CreatedAt:   truncatedNow,
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

func (s *PostService) FindNewPosts(timestampAfter time.Time, page, size int64) ([]*PostDto, error) {
	var postsData []*PostData
	var postDtos = []*PostDto{}
	var err error

	postsData, err = s.postRepository.FindNewPosts(timestampAfter, page, size)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}

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

func (s *PostService) FindPostsNow(page, size int64) ([]*PostDto, error) {
	var postsData []*PostData
	var postDtos = []*PostDto{}
	var err error

	postsData, err = s.postRepository.FindPostsNow(page, size)
	if err != nil {
		return nil, errors.New("error! call the admin")
	}

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

func (s *PostService) CountNewPosts(ownerId string, timestampAfter time.Time) (int64, error) {
	return s.postRepository.CountNewPosts(ownerId, timestampAfter)
}
