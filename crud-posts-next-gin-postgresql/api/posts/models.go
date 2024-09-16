package posts

import (
	"api/users"
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
