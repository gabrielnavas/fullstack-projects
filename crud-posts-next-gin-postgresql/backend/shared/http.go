package shared

import "net/http"

type HttpResponseBody struct {
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type WebSocketResponseBody struct {
	Type    string      `json:"type"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type WebSocketRequest struct {
	Type  string      `json"type"`
	Token string      `json:"token"`
	Body  interface{} `json:"body"`
}

func UserIdContext(r *http.Request) string {
	return r.Context().Value("userId").(string)
}
