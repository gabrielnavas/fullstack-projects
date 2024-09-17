package main

import (
	"api/auth"
	"api/posts"
	"api/users"
	"database/sql"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/joho/godotenv"
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
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// envs
	var httpPort string = os.Getenv("HTTP_PORT")
	var jwtSecretKey string = os.Getenv("JWT_SECRET")
	jwtHoursExpire, err := strconv.ParseInt(os.Getenv("JWT_HOURS_EXPIRE"), 10, 64)
	if err != nil || jwtHoursExpire <= 0 {
		panic(errors.New("missing positive JWT_HOURS_EXPIRE env"))
	}

	// databases
	db, err := OpenConnection()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// usecases, repositories and controllers
	userRepo := users.NewUserRepository(db)
	userService := users.NewUserService(userRepo)
	userController := users.NewUserController(userService)

	postRepo := posts.NewPostRepository(db)
	postService := posts.NewPostService(postRepo, userRepo)
	postController := posts.NewPostController(postService)

	authService := auth.NewAuthService(jwtSecretKey, jwtHoursExpire, userRepo)
	authController := auth.NewAuthController(authService)

	// http routes
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Post("/users", userController.InsertUser)
	r.Get("/users/{userId}", userController.FindUserById)

	r.Post("/posts", postController.InsertPost)
	r.Get("/posts", postController.FindPosts)

	r.Post("/auth/signin", authController.SignIn)

	http.ListenAndServe(":"+httpPort, r)
}
