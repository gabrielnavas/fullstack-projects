package categories

import (
	"errors"
	"log"
)

type CategoryService struct {
	categoryRepository *CategoryRepository
}

func NewCategoryService(
	categoryRepository *CategoryRepository,
) *CategoryService {
	return &CategoryService{categoryRepository}
}

func (s *CategoryService) FindCategoryByID(categoryID string) (*Category, error) {
	categoriesData, err := s.categoryRepository.FindCategoryByID(categoryID)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if categoriesData == nil {
		return nil, nil
	}
	return MapDataToModel(categoriesData)
}

func (s *CategoryService) FindCategoriesByTypeName(typeName string) ([]*Category, error) {
	categoriesData, err := s.categoryRepository.FindCategoriesByTypeName(typeName)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	var categories []*Category
	for _, categorieData := range categoriesData {
		c, err := MapDataToModel(categorieData)
		if err != nil {
			log.Println(err)
			return nil, errors.New("error! call the admin")
		}
		categories = append(categories, c)
	}
	return categories, nil
}
