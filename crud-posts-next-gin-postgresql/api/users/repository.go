package users

import (
	"database/sql"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db}
}

func (r *UserRepository) InsertUser(u *User) error {
	sqlStatement := `
		INSERT INTO public.users(
			id, username, password_hash, created_at, updated_at, deleted_at)
		VALUES ($1, $2, $3, $4, $5, $6);
	`
	_, err := r.db.Exec(sqlStatement, u.ID, u.Username,
		u.PasswordHash, u.CreatedAt, u.UpdatedAt, u.DeletedAt)
	return err
}

func (r *UserRepository) FindUserById(userId string) (*User, error) {
	sqlStatement := `
	SELECT id, username, password_hash, created_at, updated_at, deleted_at
	FROM public.users
	WHERE id = $1
	`
	var user User
	// var updatedAt time.Time
	// var deletedAt time.Time
	row := r.db.QueryRow(sqlStatement, userId)
	switch err := row.Scan(&user.ID, &user.Username, &user.PasswordHash,
		&user.CreatedAt, &user.UpdatedAt, &user.DeletedAt); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return &user, nil
	default:
		return nil, err
	}
}
