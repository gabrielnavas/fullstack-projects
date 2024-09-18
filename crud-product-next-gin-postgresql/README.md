### How to run
#### database
- execute the database
```
docker-compose up
```

#### api
- start http server
```bash
go run main
```

#### frontend
- copy .env.example to .env
- start http server
```
npm run dev
```

### screenshots

Home.
![Home](./docs/imgs/home.png)

Empty list product.
![Empty list product](./docs/imgs/empty-products.png)

Add a product.
![Add a product](./docs/imgs/add-product.png)

Add a product with data.
![Add a product with data](./docs/imgs/add-product-with-data.png)

List with one product.
![List with one product](./docs/imgs/products-list-one-item.png)

List with pagination.
![List with pagination](./docs/imgs/products-list-with-pagination.png)

Add/Update a product with form error.
![Add/Update a product with form error](./docs/imgs/form-error.png)

Delete a product.
![Delete a product](./docs/imgs/delete-product.png)

Update a product.
![Update a product](./docs/imgs/update-product.png)
