package posts

import (
	"api/shared"
	"api/token"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

type PostController struct {
	postService  *PostService
	tokenService *token.TokenService
}

func NewPostController(
	postService *PostService,
	tokenService *token.TokenService,
) *PostController {
	return &PostController{postService, tokenService}
}

func (c *PostController) InsertPost(w http.ResponseWriter, r *http.Request) {
	userId := shared.UserIdContext(r)

	var postInsert PostInsertDto
	err := json.NewDecoder(r.Body).Decode(&postInsert)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "invalid body",
		})
		return
	}

	post, err := c.postService.InsertPost(userId, postInsert)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Message: "post created",
		Data:    post,
	})
}

// func (c *PostController) CountNewPosts(w http.ResponseWriter, r *http.Request) {
// 	userId := shared.UserIdContext(r)
// 	var timestampAfterStr string = chi.URLParam(r, "timestampAfter")
// 	layout := "2006-01-02T15:04:05.999Z"
// 	timestampAfter, err := time.Parse(layout, timestampAfterStr)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		json.NewEncoder(w).Encode(shared.HttpResponseBody{
// 			Message: "format timestamp not valid",
// 		})
// 		return
// 	}

// 	count, err := c.postService.postRepository.CountNewPosts(userId, timestampAfter)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		json.NewEncoder(w).Encode(shared.HttpResponseBody{
// 			Message: "error! call the admin",
// 		})
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(shared.HttpResponseBody{
// 		Data: count,
// 	})
// }

func (c *PostController) FindPosts(w http.ResponseWriter, r *http.Request) {
	var page int64
	var size int64
	var query string

	pageStr := r.URL.Query().Get("page")
	sizeStr := r.URL.Query().Get("size")
	query = r.URL.Query().Get("query")

	if len(query) > 255 || len(pageStr) > 20 || len(sizeStr) > 20 {
		http.Error(w, "queries is too long", http.StatusBadRequest)
		return
	}

	if pageStr != "" {
		p, err := strconv.ParseInt(pageStr, 10, 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(shared.HttpResponseBody{
				Message: "invalid page",
			})
			return
		}
		if p < 0 {
			page = 0
		} else {
			page = p
		}
	} else {
		page = 0
	}

	if sizeStr != "" {
		s, err := strconv.ParseInt(sizeStr, 10, 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(shared.HttpResponseBody{
				Message: "invalid size",
			})
			return
		}
		if s < 0 {
			size = 10
		} else {
			size = s
		}
	} else {
		size = 10
	}

	posts, err := c.postService.FindPosts(page, size, query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Message: "",
		Data:    posts,
	})
}

type CountNewPostsData struct {
	TimestampAfter time.Time `json:"timestampAfter"`
}

type CountNewPostsResult struct {
	CountNewPosts int64 `json:"countNewPosts"`
}

const TYPE_COUNT_NEW_POSTS = "COUNT_NEW_POSTS"
const TYPE_ERROR = "ERROR"

func (c *PostController) CountNewPosts(conn *websocket.Conn, request *shared.WebSocketRequest) {
	var data CountNewPostsData
	err := shared.InterfaceToStruct(request.Body, &data)
	if err != nil {
		conn.WriteJSON(shared.WebSocketResponseBody{
			Type:    TYPE_ERROR,
			Message: "error! call the admin",
		})
		return
	}
	// extract token
	ownerId, err := c.tokenService.ExtractUserIdFromToken(request.Token)
	if err != nil {
		return
	}

	// get count new posts
	countNewPosts, err := c.postService.CountNewPosts(ownerId, data.TimestampAfter)
	if err != nil {
		return
	}

	println(countNewPosts)
	// Envia a mesma mensagem de volta (eco)
	conn.WriteJSON(shared.WebSocketResponseBody{
		Type: TYPE_COUNT_NEW_POSTS,
		Data: CountNewPostsResult{
			CountNewPosts: countNewPosts,
		},
	})

}
