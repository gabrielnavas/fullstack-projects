package products

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductService struct {
	db *gorm.DB
}

func NewProductService(db *gorm.DB) *ProductService {
	return &ProductService{db}
}

func (s *ProductService) AddProduct(product *Product) (*Product, error) {
	var productFound Product
	result := s.db.Where("name = ?", product.Name).First(&productFound)
	if result.RowsAffected > 0 {
		return nil, errors.New("product already exists with name")
	}

	product.ID = uuid.NewString()
	product.UpdatedAt = nil
	result = s.db.Create(product)

	if result.RowsAffected > 0 {
		return product, nil
	}
	return nil, result.Error
}

func (s *ProductService) FindProducts(limit, page int, query string) ([]Product, error) {
	var products []Product
	var result = s.db.Model(&Product{}).
		Limit(limit).
		Offset(page*limit).
		Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").
		Order("created_at asc, updated_at asc").
		Find(&products)
	if result.RowsAffected > 0 {
		return products, result.Error
	}
	return products, result.Error
}

func (s *ProductService) UpdateProduct(productId string, product *Product) error {
	var productFoundById, err = s.FindProduct(productId)
	if err != nil {
		fmt.Println(err)
		return err
	}

	var productFoundByName Product
	result := s.db.Find(&productFoundByName, "id <> ? and name = ? ", productId, product.Name)
	if result.RowsAffected > 0 {
		return errors.New("already exists a product with name")
	}

	now := time.Now()
	productFoundById.Name = product.Name
	productFoundById.Description = product.Description
	productFoundById.Price = product.Price
	productFoundById.Quantity = product.Quantity
	productFoundById.UpdatedAt = &now

	result = s.db.Save(&productFoundById)
	if result.Error != nil {
		fmt.Println(err)
		return errors.New("error on update product")
	}

	return nil
}

func (s *ProductService) FindProduct(productId string) (*Product, error) {
	var productFound Product
	result := s.db.Where("id = ?", productId).First(&productFound)
	if result.Error != nil {
		return nil, result.Error
	}

	return &productFound, nil
}

func (s *ProductService) DeleteProduct(productId string) error {
	productFound, errFind := s.FindProduct(productId)
	if errFind != nil {
		fmt.Println(errFind)
		return errFind
	}
	if productFound == nil {
		return errors.New("product not found")
	}

	result := s.db.Where("id = ?", productId).Delete(&productFound)
	if result.RowsAffected == 0 {
		return errors.New("error on delete product")
	}

	return nil
}

func (s *ProductService) CountProducts() (int64, error) {
	var count int64
	err := s.db.Model(&Product{}).Count(&count)
	return count, err.Error
}
