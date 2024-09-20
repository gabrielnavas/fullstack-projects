package wsocket

import (
	"api/posts"
	"api/shared"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type WebSocket struct {
	postsController *posts.PostController
}

func NewWebSocketPosts(postsController *posts.PostController) *WebSocket {
	return &WebSocket{postsController}
}

var upgrader = websocket.Upgrader{
	// Permite qualquer origem (cuidado com isso em produção!)
	// TODO: change this
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Função para lidar com conexões WebSocket
func (s *WebSocket) Handle(w http.ResponseWriter, r *http.Request) {
	// Faz o upgrade da conexão HTTP para WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erro ao fazer upgrade para WebSocket:", err)
		return
	}
	defer conn.Close()

	// Loop para receber mensagens
	for {
		// get current body
		var request shared.WebSocketRequest
		err := conn.ReadJSON(&request)
		if err != nil {
			log.Println("Erro ao fazer upgrade para WebSocket:", err)
			break
		}

		switch request.Type {
		case posts.TYPE_COUNT_NEW_POSTS:
			s.postsController.CountNewPosts(conn, &request)
		default:
			conn.WriteJSON(shared.WebSocketResponseBody{
				Message: "type not found",
				Type:    "error",
			})
		}

	}
}
