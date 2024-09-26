'use client'

import { findCategories } from "@/services/find-category";
import { Category, Transaction, TypeTransaction } from "@/services/models";
import React, { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./auth-context";
import { insertTransaction } from "@/services/insert-transaction";
import { findTransactions } from "@/services/find-transactions";
import { findTypeTransactions } from "@/services/find-type-transactions";

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
  categoriasForm: Category[]
  typeTransactions: TypeTransaction[]
  allCategories: Category[]
  transactions: Transaction[]
  isLoading: boolean
  handleFindCategories: (typeTransactionName: string) => Promise<FindCategoriesResult>
  handleInsertTransaction: (data: InserTransaction) => Promise<InsertTransactionResult>
  handleFindTransactions: () => void
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

  const [typeTransactions, setTypeTransactions] = useState<TypeTransaction[]>([])

  const [categoriasForm, setCategoriasForm] = useState<Category[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useContext(AuthContext) as AuthContextType

  // init type transactions list
  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      const result = await findTypeTransactions(token)()
      if (!result.error && result.data) {
        setTypeTransactions(result.data)
      }
    })()
  }, [token])

  // init first categories form 
  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }
      if (typeof categoriasForm !== 'object' || categoriasForm.length > 0) {
        return
      }

      // income categories
      let typeTransactionName = typeTransactionNames[0].name
      let result = await findCategories(token)(typeTransactionName!)
      if (result.data) {
        setAllCategories(result.data)
        setCategoriasForm(result.data)
      }

      // expense categories
      typeTransactionName = typeTransactionNames[1].name
      result = await findCategories(token)(typeTransactionName!)
      if (result.data !== undefined) {
        setAllCategories(prev => [...prev, ...result.data!])
      }
    })()

  }, [token, typeTransactionNames, categoriasForm])


  const handleFindTransactions = useCallback(async () => {
    if (typeof token !== 'string' || token.length === 0) {
      return
    }
    const result = await findTransactions(token)()
    setTransactions(result.data!)

  }, [token])


  const handleInsertTransaction = useCallback(async (data: InserTransaction): Promise<InsertTransactionResult> => {
    setIsLoading(true)
    let insertResult: InsertTransactionResult
    try {
      const result = await insertTransaction(token)(data)
      insertResult = {
        message: result.message,
        success: !result.error
      }
      if (insertResult.success) {
        await handleFindTransactions()
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

  }, [token, handleFindTransactions])

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
          setCategoriasForm(result.data)
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
      categoriasForm,
      allCategories,
      typeTransactions,
      transactions,
      isLoading,
      handleFindCategories,
      handleInsertTransaction,
      handleFindTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
}
