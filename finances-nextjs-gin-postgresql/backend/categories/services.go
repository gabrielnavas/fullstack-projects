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
	category, err := s.categoryRepository.FindCategoryByID(categoryID)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	if category == nil {
		return nil, nil
	}
	return category, nil
}

func (s *CategoryService) FindCategoriesByTypeName(typeName string) ([]*Category, error) {
	categories, err := s.categoryRepository.FindCategoriesByTypeName(typeName)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	return categories, nil
}

func (s *CategoryService) FindCategories() ([]*Category, error) {
	categories, err := s.categoryRepository.FindCategories()
	if err != nil {
		log.Println(err)
		return nil, errors.New("error! call the admin")
	}
	return categories, nil
}
