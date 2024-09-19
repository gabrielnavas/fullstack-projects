package posts

import "time"

type PostInsertDto struct {
	Description string `json:"description"`
}

type PostDto struct {
	ID          string     `json:"id"`
	Description string     `json:"description"`
	ViewsCount  int64      `json:"viewsCount"`
	LikesCount  int64      `json:"likesCount"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt,omitempty"`
	OwnerID     string     `json:"ownerId"`
}
