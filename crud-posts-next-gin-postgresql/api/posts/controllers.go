package posts

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type PostController struct {
	postService *PostService
}

func NewPostController(pService *PostService) *PostController {
	return &PostController{pService}
}

func (c *PostController) InsertPost(w http.ResponseWriter, r *http.Request) {
	var postInsert PostInsert
	err := json.NewDecoder(r.Body).Decode(&postInsert)
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	post, err := c.postService.InsertPost(postInsert)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}

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
			http.Error(w, "invalid page", http.StatusBadRequest)
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
			http.Error(w, "invalid page", http.StatusBadRequest)
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
	json.NewEncoder(w).Encode(posts)
}
