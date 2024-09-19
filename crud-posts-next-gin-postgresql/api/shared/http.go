package shared

import "net/http"

type HttpResponseBody struct {
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func UserIdContext(r *http.Request) string {
	return r.Context().Value("userId").(string)
}
