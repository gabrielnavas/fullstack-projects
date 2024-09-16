package main

import (
	"api/users"
	"database/sql"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	_ "github.com/lib/pq"
)

func OpenConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", "host=localhost port=5432 user=postgres password=postgres123 dbname=postgres sslmode=disable")
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	return db, err
}

func main() {
	db, err := OpenConnection()
	if err != nil {
		panic(err)
	}

	userRepo := users.NewUserRepository(db)
	userService := users.NewUserService(userRepo)
	userController := users.NewUserController(userService)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Post("/users", userController.InsertUser)
	r.Get("/users/{userId}", userController.FindUserById)

	http.ListenAndServe(":3001", r)
}
