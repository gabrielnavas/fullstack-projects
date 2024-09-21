package posts

import (
	"api/shared"
	"api/token"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
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

func (c *PostController) FindNewPosts(w http.ResponseWriter, r *http.Request) {
	var page int64
	var size int64
	var timestampAfter time.Time

	var posts []*PostDto
	var err error

	pageStr := r.URL.Query().Get("page")
	sizeStr := r.URL.Query().Get("size")

	timestampAfterStr := chi.URLParam(r, "timestampAfter")
	if timestampAfterStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "invalid timestampAfter param",
		})
		return
	}
	layout := "2006-01-02T15:04:05.999Z"
	timestampAfter, err = time.Parse(layout, timestampAfterStr)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "error! call the admin",
		})
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

	posts, err = c.postService.FindNewPosts(timestampAfter, page, size)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: err.Error(),
		})
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Data: posts,
	})
}

func (c *PostController) FindPosts(w http.ResponseWriter, r *http.Request) {
	var page int64
	var size int64

	var posts []*PostDto
	var err error

	pageStr := r.URL.Query().Get("page")
	sizeStr := r.URL.Query().Get("size")

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

	posts, err = c.postService.FindPostsNow(page, size)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(shared.HttpResponseBody{
			Message: "missing typeFindPost valid",
		})
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponseBody{
		Data: posts,
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

	// Envia a mesma mensagem de volta (eco)
	conn.WriteJSON(shared.WebSocketResponseBody{
		Type: TYPE_COUNT_NEW_POSTS,
		Data: CountNewPostsResult{
			CountNewPosts: countNewPosts,
		},
	})

}
