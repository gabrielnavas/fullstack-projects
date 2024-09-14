'use client'

import React, { useCallback, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";

import { Table, TableContextType } from "@/components/products/context/types";

import { Product } from "@/services/products/product";
import createProduct, { CreateProduct } from "@/services/products/create-product";
import deleteProduct from "@/services/products/delete-product";
import findProducts from "@/services/products/find-products";
import updatedProduct, { UpdateProduct } from "@/services/products/update-product";
import { updateImageProduct } from "@/services/products/update-image-product";

export const TableContext = React.createContext<TableContextType | null>(null);

const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sizeOptions = [10, 20, 30, 50, 70, 100]

  const inititalTable = {
    data: [] as Product[],
    totalItems: 0,
    totalPages: 0,
    page: 0,
    size: sizeOptions[0],
    query: '',
    isEmpty: false,
    isLoading: false,
  }
  const [table, setTable] = React.useState<Table>({ ...inititalTable });

  const { toast } = useToast()

  useEffect(() => {
    refresh();
  }, [table.size, table.page])

  const initTable = useCallback(() => {
    setTable({ ...inititalTable })
  }, [])

  const refresh = useCallback(async () => {
    setTable(prev => ({ ...prev, isLoading: true }))
    const { data, totalItems } = await findProducts(table.page, table.size, table.query)
    const totalPages = Math.ceil(totalItems / table.size)
    setTable(prev => ({
      ...prev,
      data,
      totalItems,
      totalPages,
      isEmpty: data.length === 0
    }))
    setTable(prev => ({ ...prev, isLoading: false }))
  }, [table.size, table.page, table.query])


  const handleDeleteProduct = useCallback(async (item: Product): Promise<boolean> => {
    let success = false;
    const result = await deleteProduct(item.id)

    if (!result.error) {
      initTable()
      await refresh();
      toast({
        title: 'Deleted!!',
        description: result.message,
        duration: 5000,
      })
      success = true;
    } else {
      toast({
        title: 'Oops!! attention!',
        description: result.message,
        variant: 'destructive',
        duration: 7000,
      })
    }

    return success
  }, [])

  const handleAddProduct = useCallback(async (productToCreate: CreateProduct, image: File | null) => {
    let success = false;

    const product = {
      description: productToCreate.description,
      name: productToCreate.name,
      price: productToCreate.price,
      quantity: productToCreate.quantity
    } as Product
    // add product
    const createProductResult = await createProduct(product)
    if (createProductResult.error) {
      toast({
        title: 'Oops!! attention!',
        description: createProductResult.message,
        variant: 'destructive',
        duration: 7000,
      })
      return success
    }

    if (image === null) {
      toast({
        title: 'Success!',
        description: createProductResult.message,
        duration: 5000,
      })
      success = true;
      await refresh();
    } else {

      // add image
      const productCreated = createProductResult.data
      if (productCreated !== null) {
        const result = await updateImageProduct(productCreated.id, image)
        if (result.error) {
          toast({
            title: 'Oops!! attention!',
            description: result.message,
            variant: 'destructive',
            duration: 7000,
          })
          return success
        } else {
          toast({
            title: 'Success!',
            description: createProductResult.message,
            duration: 5000,
          })
          success = true;
          await refresh();
        }
      }
    }

    return success
  }, [])

  const handleUpdateProduct = useCallback(async (
    productId: string,
    productToUpdate: UpdateProduct,
    image: File | null
  ): Promise<boolean> => {
    let closeModal = false;
    const updatedProductResult = await updatedProduct(productId, productToUpdate)
    if (updatedProductResult.error) {
      toast({
        title: 'Oops!! attention!',
        description: updatedProductResult.message,
        variant: 'destructive',
        duration: 7000,
      })
    } else {

      if (image === null) {
        initTable()
        await refresh();
        closeModal = true;
        toast({
          title: 'Success!',
          description: updatedProductResult.message,
          duration: 5000,
        })
      } else {
        // add image
        const result = await updateImageProduct(productId, image)
        if(result.error) {
          if (result.error) {
            toast({
              title: 'Oops!! attention!',
              description: result.message,
              variant: 'destructive',
              duration: 7000,
            })
          } 
        } else {
          initTable()
          await refresh();
          closeModal = true;
          toast({
            title: 'Success!',
            description: updatedProductResult.message,
            duration: 5000,
          })
        }
      }
    }

    return closeModal;
  }, [])


  const handleSetSize = useCallback((size: number): void => {
    initTable();
    setTable(prev => ({ ...prev, size }))
  }, [])

  const handleSetPageMinus = useCallback((many: number) => {
    setTable(prev => ({ ...prev, page: prev.page - many }));
  }, [])

  const handleSetPagePlus = useCallback((many: number) => {
    setTable(prev => ({ ...prev, page: prev.page + many }));
  }, [])

  const handleUpdateInputSearch = useCallback((value: string) => {
    setTable(prev => ({ ...prev, query: value }));
  }, [])

  return (
    <TableContext.Provider value={{
      handleAddProduct,
      handleDeleteProduct,
      handleUpdateProduct,
      table,
      handleSetSize,
      handleSetPageMinus,
      handleSetPagePlus,
      sizeOptions,
      handleUpdateInputSearch,
      refresh,
    }}>
      {children}
    </TableContext.Provider>
  )
}

export default TableProvider
