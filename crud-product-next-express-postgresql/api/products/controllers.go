package products

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductController struct {
	productService *ProductService
}

func NewProductController(productService *ProductService) *ProductController {
	return &ProductController{productService}
}

func (controller *ProductController) CreateProduct(c *gin.Context) {
	var product Product

	err := c.ShouldBindBodyWithJSON(&product)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "error on body",
		})
		return
	}

	err = product.Validate()
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	productCreated, err := controller.productService.AddProduct(&product)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(201, gin.H{
		"data":    productCreated,
		"message": "product created",
	})
}

func (controller *ProductController) UpdateProduct(c *gin.Context) {
	productId := c.Param("product-id")

	var product Product

	err := c.ShouldBindBodyWithJSON(&product)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "error on body",
		})
		return
	}

	err = product.Validate()
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	err = controller.productService.UpdateProduct(productId, &product)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.Status(204)
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return false
}

func (controller *ProductController) UpdateProductImage(c *gin.Context) {
	productId := c.Param("product-id")

	file, _ := c.FormFile("image")
	dst := "uploads/products/" + productId + "/" + "image.png"

	// remove
	// Remover o arquivo
	if fileExists(dst) {
		err := os.Remove(dst)
		if err != nil {
			fmt.Println("error on remove file:", err)
			return
		}
	}

	// save
	err := c.SaveUploadedFile(file, dst)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "error on save image",
		})
		return
	}
	c.Status(204)
}

func (controller *ProductController) DownloadProductImage(c *gin.Context) {
	productId := c.Param("product-id")
	dir := "uploads/products/" + productId

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "error! call the admin",
		})
		return
	}

	if len(files) == 0 {
		c.JSON(404, gin.H{
			"message": "image not found",
		})
		return
	}

	image := files[0]

	imagePath := dir + "/" + "image.png"
	contentType := "application/png"

	c.Header("Content-Disposition", "attachment; filename="+image.Name())
	c.Header("Content-Type", contentType)

	c.File(imagePath)
}

func (controller *ProductController) DeleteProduct(c *gin.Context) {
	productId := c.Param("product-id")

	err := controller.productService.DeleteProduct(productId)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.Status(204)
}

func (controller *ProductController) FindProducts(c *gin.Context) {
	size, _ := strconv.Atoi(c.DefaultQuery("size", "10"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	query := c.DefaultQuery("query", "")

	if size < 0 || page < 0 {
		c.JSON(400, gin.H{
			"message": "size and page must be positive",
		})
		return
	}

	if len(query) > 255 {
		c.JSON(400, gin.H{
			"message": "query is too long",
		})
		return
	}

	products, err := controller.productService.FindProducts(size, page, query)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	countProducts, err := controller.productService.CountProducts()
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"data":       products,
		"totalItems": countProducts,
	})
}
