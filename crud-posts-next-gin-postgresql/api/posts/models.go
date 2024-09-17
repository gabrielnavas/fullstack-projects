package posts

import (
	"api/users"
	"errors"
	"time"
)

type Post struct {
	ID          string
	Description string
	Views       []View
	ViewsCount  int64
	Likes       []Like
	LikesCount  int64
	CreatedAt   time.Time
	UpdatedAt   *time.Time
	DeletedAt   *time.Time
	Owner       *users.User
}

func (p *Post) Validate() error {
	var err error

	if p.ID == "" {
		err = errors.New("id must be defined")
	} else if len(p.Description) == 0 {
		err = errors.New("description is empty")
	} else if len(p.Description) > 120 {
		err = errors.New("description is too big")
	} else if p.ViewsCount < 0 {
		err = errors.New("views must be zero or positive")
	} else if p.LikesCount < 0 {
		err = errors.New("likes must be zero or positive")
	} else if p.Owner == nil {
		err = errors.New("owner must be defined")
	}

	return err
}

type Like struct {
	ID        string
	CreatedAt time.Time
	Post      Post
	Owner     users.User
}

type View struct {
	ID        string
	CreatedAt time.Time
	Post      Post
	Owner     users.User
}
