package main

import (
	"api/auth"
	"api/categories"
	"api/postgresql"
	"api/tokens"
	"api/transactions"
	"api/users"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")

	db, err := postgresql.OpenConnection()
	if err != nil {
		panic(err)
	}

	var userRepository *users.UserRepository = users.NewUserRepository(db)
	var userService *users.UserService = users.NewUserService(userRepository)

	var tokenService *tokens.TokenService = tokens.NewTokenService(jwtSecretKey)
	var authService *auth.AuthService = auth.NewAuthService(tokenService, userService)

	var authMiddleware *auth.AuthMiddleware = auth.NewAuthMiddleware(tokenService, userService)
	var authController *auth.AuthController = auth.NewAuthController(userService, authService)

	var transactionRepository *transactions.TransactionRepository = transactions.NewTransactionRepository(db)

	var categoryRepository *categories.CategoryRepository = categories.NewCategoryRepository(db)
	var categoryService *categories.CategoryService = categories.NewCategoryService(categoryRepository)
	var categoryController *categories.CategoryController = categories.NewCategoryControler(categoryService)

	var transactionService = transactions.NewTransactionService(
		transactionRepository, categoryService, userService,
	)
	var transactionsController *transactions.TransactionController = transactions.NewTransactionController(transactionService)

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

	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/signup", authController.SignUp)
		r.Post("/signin", authController.SignIn)
	})

	r.Route("/api/categories", func(r chi.Router) {
		r.Use(authMiddleware.AutorizationTokenBearerHeader)
		r.Get("/", categoryController.FindCategories)
	})

	r.Route("/api/transactions", func(r chi.Router) {
		r.Use(authMiddleware.AutorizationTokenBearerHeader)
		r.Post("/", transactionsController.InsertTransaction)
	})

	// start http server
	http.ListenAndServe(":3001", r)
}
