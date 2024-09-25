package categories

import (
	"api/shared"
	"encoding/json"
	"log"
	"net/http"
)

type CategoryController struct {
	categoryService *CategoryService
}

func NewCategoryControler(
	categoryService *CategoryService,
) *CategoryController {
	return &CategoryController{
		categoryService,
	}
}

func (c *CategoryController) FindCategories(w http.ResponseWriter, r *http.Request) {
	typeName := r.URL.Query().Get("typeName")

	if len(typeName) > 50 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "type name is soo long",
		})
		return
	} else if len(typeName) > 0 {
		categories, err := c.categoryService.FindCategoriesByTypeName(typeName)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(shared.HttpResponse{
				Message: err.Error(),
			})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(shared.HttpResponse{
			Message: "type name is soo long",
			Data:    categories,
		})
		return
	}
}
