package posts

import "database/sql"

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db}
}

func (r *PostRepository) InsertPost(p *Post) error {
	sqlStatement := `
		INSERT INTO public.posts (
			id, description, likes_count, views_count, created_at, updated_at, deleted_at, owner_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	_, err := r.db.Exec(sqlStatement, p.ID, p.Description, p.LikesCount, p.ViewsCount, p.CreatedAt, p.UpdatedAt, p.DeletedAt, p.Owner.ID)
	return err
}

func (r *PostRepository) FindPosts(page, size int64, query string) ([]*Post, error) {
	var offset int64 = page * size
	var posts []*Post = []*Post{}
	var p Post
	var rows *sql.Rows
	var err error

	if page > 0 {
		offset = offset - size
	}

	sqlStatement := `
		SELECT id, description, likes_count, views_count, created_at, updated_at, deleted_at
		FROM public.posts
	`

	if query != "" {
		sqlStatement += " WHERE description ILIKE $1 LIMIT $2 OFFSET $3"
		likeQuery := "%" + query + "%"
		rows, err = r.db.Query(sqlStatement, likeQuery, size, offset)
	} else {
		sqlStatement += " LIMIT $1 OFFSET $2"
		rows, err = r.db.Query(sqlStatement, size, offset)
	}

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		p = Post{}
		rows.Scan(&p.ID, &p.Description, &p.LikesCount, &p.ViewsCount, &p.CreatedAt, &p.UpdatedAt, &p.DeletedAt)
		posts = append(posts, &p)
	}
	return posts, err
}
