package users

import (
	"database/sql"
	"time"
)

type UserRepository struct {
	db *sql.DB
}

type UserData struct {
	ID           string
	Fullname     string
	Email        string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    *time.Time
	DeletedAt    *time.Time
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db}
}

func (r *UserRepository) InsertUser(d *UserData) error {
	sqlStatement := `
		INSERT INTO public.users (
			id, fullname, email, password_hash, created_at, updated_at, deleted_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := r.db.Exec(sqlStatement,
		d.ID, d.Fullname, d.Email,
		d.PasswordHash, d.CreatedAt, d.UpdatedAt, d.DeletedAt,
	)
	return err
}
