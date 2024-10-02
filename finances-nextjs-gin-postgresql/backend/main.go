package main

import (
	"api/auth"
	"api/categories"
	"api/env"
	"api/postgresql"
	"api/tokens"
	"api/transactions"
	"api/typetransactions"
	"api/users"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {

	// postgres database
	pg := postgresql.NewPostgreSQL(
		env.PgHost,
		env.PgPort,
		env.PgUser,
		env.PgPassword,
		env.PgDbName,
		env.PgSslMode,
	)
	db, err := pg.Instance()
	if err != nil {
		panic(err)
	}

	// wrappers
	var transactionWrapper *transactions.TransactionWrapper = transactions.NewTransactionWrapper()
	var typeTransactionWrapper *typetransactions.TypeTransactionWrapper = typetransactions.NewTypeTransactionWrapper()
	var typeCategoryWrapper *categories.CategoryWrapper = categories.NewCategoryWrapper()

	// repositories
	var userRepository *users.UserRepository = users.NewUserRepository(db)
	var categoryRepository *categories.CategoryRepository = categories.NewCategoryRepository(
		db,
		typeCategoryWrapper,
	)
	var typeTransactionRepository *typetransactions.TypeTransactionRepository = typetransactions.NewTypeTransactionRepository(
		db,
		typeTransactionWrapper,
	)
	var transactionRepository *transactions.TransactionRepository = transactions.NewTransactionRepository(
		db,
		transactionWrapper,
		typeTransactionWrapper,
	)

	// services
	var userService *users.UserService = users.NewUserService(userRepository)
	var tokenService *tokens.TokenService = tokens.NewTokenService(
		env.JwtSecretKey,
		env.JwtExpirationSeconds,
	)
	var authService *auth.AuthService = auth.NewAuthService(tokenService, userService)
	var categoryService *categories.CategoryService = categories.NewCategoryService(
		categoryRepository,
	)
	var transactionService = transactions.NewTransactionService(
		transactionRepository,
		transactionWrapper,
		typeTransactionWrapper,
		categoryService,
		userService,
	)
	var typeTransactionService *typetransactions.TypeTransactionService = typetransactions.NewTypeTransactionService(
		typeTransactionRepository,
	)

	// middlewares
	var authMiddleware *auth.AuthMiddleware = auth.NewAuthMiddleware(tokenService, userService)
	var authController *auth.AuthController = auth.NewAuthController(userService, authService)

	// controllers
	var typeTransactionController *typetransactions.TypeTransactionController = typetransactions.NewTypeTransactionController(
		typeTransactionService,
	)
	var categoryController *categories.CategoryController = categories.NewCategoryControler(categoryService)
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

	r.Route("/api/type-transactions", func(r chi.Router) {
		r.Use(authMiddleware.AutorizationTokenBearerHeader)
		r.Get("/", typeTransactionController.FindTypeTransactions)
	})

	r.Route("/api/transactions", func(r chi.Router) {
		r.Use(authMiddleware.AutorizationTokenBearerHeader)
		r.Post("/", transactionsController.InsertTransaction)
		r.Get("/", transactionsController.FindTransactions)
	})

	// start http server
	addr := fmt.Sprintf(":%s", env.ServerPort)
	err = http.ListenAndServe(addr, r)
	if err != nil {
		panic(err)
	}
}
