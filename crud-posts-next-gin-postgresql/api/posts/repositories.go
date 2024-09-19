package posts

import (
	"database/sql"
	"time"
)

type PostData struct {
	ID          string
	Description string
	LikesCount  int64
	ViewsCount  int64
	CreatedAt   time.Time
	UpdatedAt   *time.Time
	DeletedAt   *time.Time
	OwnerID     string
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db}
}

func (r *PostRepository) orderByQuery() string {
	return " ORDER BY created_at DESC, updated_at DESC "
}

func (r *PostRepository) InsertPost(p *PostData) error {
	p.CreatedAt = p.CreatedAt.Truncate(time.Microsecond)
	if p.UpdatedAt != nil {
		up := p.UpdatedAt.Truncate(time.Microsecond)
		p.UpdatedAt = &up
	}
	if p.DeletedAt != nil {
		del := p.DeletedAt.Truncate(time.Microsecond)
		p.DeletedAt = &del
	}
	sqlStatement := `
		INSERT INTO public.posts (
			id, description, likes_count, views_count, created_at, updated_at, deleted_at, owner_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	_, err := r.db.Exec(sqlStatement, p.ID, p.Description, p.LikesCount,
		p.ViewsCount, p.CreatedAt, p.UpdatedAt, p.DeletedAt, p.OwnerID)
	return err
}

func (r *PostRepository) CountNewPosts(ownerId string, afterDate time.Time) (count int64, err error) {
	sqlStatement := `
		SELECT count(*)
		FROM public.posts 
		WHERE deleted_at IS NULL 
			AND id <> $1
			AND created_at > $2::timestamptz
	`
	// orderBy := r.orderByQuery()
	// groupBy := " GROUP BY created_at, updated_at "
	// sqlStatement += groupBy + orderBy
	row := r.db.QueryRow(sqlStatement, ownerId, afterDate)
	err = row.Scan(&count)
	return
}

func (r *PostRepository) FindPosts(page, size int64, query string) ([]*PostData, error) {
	var offset int64 = page * size
	var posts []*PostData = []*PostData{}
	var rows *sql.Rows
	var err error

	if page > 0 {
		offset = offset - size
	}

	sqlStatement := `
		SELECT id, description, likes_count, views_count, 
		created_at, updated_at, owner_id
		FROM public.posts
		WHERE deleted_at IS NULL
	`
	orderBy := r.orderByQuery()
	if query != "" {
		sqlStatement += " AND description ILIKE $1 " + orderBy + " LIMIT $2 OFFSET $3 "
		likeQuery := "%" + query + "%"
		rows, err = r.db.Query(sqlStatement, likeQuery, size, offset)
	} else {
		sqlStatement += orderBy + " LIMIT $1 OFFSET $2"
		rows, err = r.db.Query(sqlStatement, size, offset)
	}
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p = PostData{}
		rows.Scan(&p.ID, &p.Description, &p.LikesCount, &p.ViewsCount, &p.CreatedAt, &p.UpdatedAt, &p.OwnerID)
		posts = append(posts, &p)
	}

	return posts, err
}
