package main

import (
	"api/auth"
	"api/postgres"
	"api/posts"
	"api/token"
	"api/users"
	"api/wsocket"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// envs
	var httpPort string = os.Getenv("HTTP_PORT")
	var jwtSecretKey string = os.Getenv("JWT_SECRET")

	// jwt hours expire env
	jwtHoursExpire, err := strconv.ParseInt(os.Getenv("JWT_HOURS_EXPIRE"), 10, 64)
	if err != nil || jwtHoursExpire <= 0 {
		panic(errors.New("missing positive JWT_HOURS_EXPIRE env"))
	}

	// databases
	db, err := postgres.OpenConnection()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// usecases, repositories and controllers
	userRepo := users.NewUserRepository(db)
	userService := users.NewUserService(userRepo)
	userController := users.NewUserController(userService)

	tokenService := token.NewTokenService(jwtSecretKey, jwtHoursExpire)
	tokenMiddleware := token.NewTokenHttpMiddleware(tokenService, userService)

	authService := auth.NewAuthService(jwtSecretKey, jwtHoursExpire, userRepo, tokenService)
	authController := auth.NewAuthController(authService, userService)

	postRepo := posts.NewPostRepository(db)
	postService := posts.NewPostService(postRepo, userRepo)
	postController := posts.NewPostController(postService, tokenService)

	// http routes
	r := chi.NewRouter()

	// global http middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	// cors
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Route("/posts", func(r chi.Router) {
		r.Use(tokenMiddleware.CheckAutorizationHeader)
		r.Post("/", postController.InsertPost)
		r.Get("/", postController.FindPosts)
	})

	r.Route("/users", func(r chi.Router) {
		r.Use(tokenMiddleware.CheckAutorizationHeader)
		r.Get("/{userId}", userController.FindUserById)
	})

	r.Post("/auth/signin", authController.SignIn)
	r.Post("/auth/signup", authController.SignUp)
	// testing ping
	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	// init http api
	go func() {
		errApi := http.ListenAndServe(":"+httpPort, r)
		if errApi != nil {
			panic(errApi)
		}
	}()

	// websockets
	ws := wsocket.NewWebSocketPosts(postController)

	http.HandleFunc("/ws", ws.Handle)

	webSocketPort := "8080"

	fmt.Println("Servidor WebSocket rodando em http://localhost" + webSocketPort + "/ws")
	err = http.ListenAndServe(":"+webSocketPort, nil)
	if err != nil {
		log.Fatal("Erro ao iniciar o servidor:", err)
	}
}
