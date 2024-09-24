package main

import (
	"api/auth"
	"api/postgresql"
	"api/users"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {

	db, err := postgresql.OpenConnection()
	if err != nil {
		panic(err)
	}

	var userRepository *users.UserRepository = users.NewUserRepository(db)
	var authController *auth.AuthController = auth.NewAuthController(
		userRepository,
	)

	// init router
	r := chi.NewRouter()

	// // middlewares
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
		// ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Route("/api", func(r chi.Router) {
		r.Post("/auth/signup", authController.SignUp)
	})

	// start http server
	http.ListenAndServe(":3001", r)
}
