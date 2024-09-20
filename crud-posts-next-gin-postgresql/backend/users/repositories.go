package users

import (
	"database/sql"
	"time"
)

type UserData struct {
	ID           string
	Username     string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    *time.Time
	DeletedAt    *time.Time
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db}
}

func (r *UserRepository) InsertUser(u *UserData) error {
	sqlStatement := `
		INSERT INTO public.users(
			id, username, password_hash, created_at, updated_at, deleted_at)
		VALUES ($1, $2, $3, $4, $5, $6);
	`
	_, err := r.db.Exec(sqlStatement, u.ID, u.Username,
		u.PasswordHash, u.CreatedAt, u.UpdatedAt, u.DeletedAt)
	return err
}

func (r *UserRepository) FindUserById(userId string) (*UserData, error) {
	sqlStatement := "SELECT " + r.getUserAllAttributes() + " FROM " + r.getUserTableName() + " WHERE id = $1"
	row := r.db.QueryRow(sqlStatement, userId)
	return r.mapOne(row)
}

func (r *UserRepository) FindUserByUsername(username string) (*UserData, error) {
	sqlStatement := "SELECT " + r.getUserAllAttributes() + " FROM " + r.getUserTableName() + " WHERE username = $1"
	row := r.db.QueryRow(sqlStatement, username)
	return r.mapOne(row)
}

func (r *UserRepository) getUserAllAttributes() string {
	return "id, username, password_hash, created_at, updated_at, deleted_at"
}

func (r *UserRepository) getUserTableName() string {
	return "public.users"
}

func (r *UserRepository) mapOne(row *sql.Row) (*UserData, error) {
	var user UserData
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
