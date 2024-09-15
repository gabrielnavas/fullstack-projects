package main

import (
	"api/products"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// routes
	r := gin.Default()
	r.Use(newCors())
	r.MaxMultipartMemory = 10 << 20 // 10 MiB

	db := newDb()
	productService := products.NewProductService(db)
	productController := products.NewProductController(productService)

	r.POST("/api/products", productController.CreateProduct)
	r.PATCH("/api/products/:product-id", productController.UpdateProduct)
	r.PATCH("/api/products/:product-id/images", productController.UpdateProductImage)
	r.DELETE("/api/products/:product-id", productController.DeleteProduct)
	r.GET("/api/products", productController.FindProducts)
	r.GET("/api/products/:product-id/images", productController.DownloadProductImage)
	r.Run()
}

func newDb() *gorm.DB {
	dsn := "host=localhost user=postgres password=postgres123 dbname=postgres port=5432 sslmode=disable TimeZone=America/Sao_Paulo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return db
}

func newCors() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	})
}
