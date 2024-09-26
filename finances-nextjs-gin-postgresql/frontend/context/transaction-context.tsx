'use client'

import { findCategories } from "@/services/find-category";
import { Category } from "@/services/models";
import React, { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./auth-context";
import { insertTransaction } from "@/services/insert-transaction";

type InsertTransactionResult = {
  success: boolean,
  message: string,
}

type FindCategoriesResult = {
  sucess: boolean,
  message: string,
}

export type TransactionContextType = {
  typeTransactionNames: { name: string, displayName: string }[]
  categories: Category[]
  isLoading: boolean
  handleFindCategories: (typeTransactionName: string) => Promise<FindCategoriesResult>
  handleInsertTransaction: (data: InserTransaction) => Promise<InsertTransactionResult>
}

export const TransactionContext = createContext<TransactionContextType | null>(null)

type Props = {
  children: React.ReactNode
}

type InserTransaction = {
  amount: number;
  categoryId: string;
  description: string;
  typeTransactionName: string;
}

export const TransactionContextProvider: FC<Props> = ({ children }) => {
  const [typeTransactionNames] = useState([
    { name: "income", displayName: "Renda" },
    { name: "expense", displayName: "Despesa" }
  ])

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useContext(AuthContext) as AuthContextType

  // init first categories list
  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }
      if (typeof categories !== 'object' || categories.length > 0) {
        return
      }

      const typeTransactionName = typeTransactionNames[0].name
      const result = await findCategories(token)(typeTransactionName!)
      if (result.data) {
        setCategories(result.data)
      }
    })()

  }, [token, typeTransactionNames, categories])

  const handleInsertTransaction = useCallback(async (data: InserTransaction): Promise<InsertTransactionResult> => {
    setIsLoading(true)
    let insertResult: InsertTransactionResult
    try {
      const result = await insertTransaction(token)(data)
      insertResult = {
        message: result.message,
        success: !result.error
      }
    } catch {
      insertResult = {
        message: 'Ooops! algo aconteceu',
        success: false
      }
    } finally {
      setIsLoading(false)

    }
    return insertResult

  }, [token])

  const handleFindCategories = useCallback(
    async (typeTransactionName: string): Promise<FindCategoriesResult> => {
      let findCategoryResult: FindCategoriesResult

      try {
        setIsLoading(true)
        const result = await findCategories(token)(typeTransactionName!)
        findCategoryResult = {
          message: result.message,
          sucess: !result.error
        }
        if (result.data) {
          setCategories(result.data)
        }
      } catch {
        findCategoryResult = {
          message: 'Ooops! Algo aconteceu!',
          sucess: false
        }
      }
      finally {
        setIsLoading(false)
      }

      return findCategoryResult
    }, [token])


  return (
    <TransactionContext.Provider value={{
      typeTransactionNames,
      categories,
      isLoading,
      handleFindCategories,
      handleInsertTransaction,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}
