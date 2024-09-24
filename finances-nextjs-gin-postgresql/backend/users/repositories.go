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
	FullName     string
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
		d.ID, d.FullName, d.Email,
		d.PasswordHash, d.CreatedAt, d.UpdatedAt, d.DeletedAt,
	)
	return err
}

func (r *UserRepository) FindUserById(userId string) (*UserData, error) {
	sqlStatement := `
		SELECT id, fullname, email, password_hash, created_at, updated_at, deleted_at
		FROM public.users
		WHERE id = $1
	`
	row := r.db.QueryRow(sqlStatement, userId)
	return r.mapOne(row)
}

func (r *UserRepository) FindUserByEmail(email string) (*UserData, error) {
	sqlStatement := `
		SELECT id, fullname, email, password_hash, created_at, updated_at, deleted_at
		FROM public.users
		WHERE email = $1
	`
	row := r.db.QueryRow(sqlStatement, email)
	return r.mapOne(row)
}

func (r *UserRepository) mapOne(row *sql.Row) (*UserData, error) {
	var u UserData
	switch err := row.Scan(&u.ID, &u.FullName, &u.Email, &u.PasswordHash,
		&u.CreatedAt, &u.UpdatedAt, &u.DeletedAt); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return &u, nil
	default:
		return nil, err
	}
}
