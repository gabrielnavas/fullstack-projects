package typetransactions

import (
	"api/shared"
	"encoding/json"
	"net/http"
)

type TypeTransactionController struct {
	tts *TypeTransactionService
}

func NewTypeTransactionController(
	tts *TypeTransactionService,
) *TypeTransactionController {
	return &TypeTransactionController{tts}
}

func (c *TypeTransactionController) FindTypeTransactions(w http.ResponseWriter, r *http.Request) {
	tts, err := c.tts.FindTypeTransactions()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: err.Error(),
		})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shared.HttpResponse{
		Data: tts,
	})
}
