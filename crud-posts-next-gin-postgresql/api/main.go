package main

import (
	"api/posts"
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
	defer db.Close()

	userRepo := users.NewUserRepository(db)
	userService := users.NewUserService(userRepo)
	userController := users.NewUserController(userService)

	postRepo := posts.NewPostRepository(db)
	postService := posts.NewPostService(postRepo, userRepo)
	postController := posts.NewPostController(postService)

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Post("/users", userController.InsertUser)
	r.Get("/users/{userId}", userController.FindUserById)

	r.Post("/posts", postController.InsertPost)
	r.Get("/posts", postController.FindPosts)

	http.ListenAndServe(":3001", r)
}
