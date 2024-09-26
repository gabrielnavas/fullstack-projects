'use client'

import { findCategoriesByTypeTransaction } from "@/services/find-category";
import { Category, Transaction, TypeTransaction, TypeTransactionName } from "@/services/models";
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
  categoriasByTypeTransactions: Category[]
  typeTransactions: TypeTransaction[]
  allCategories: Category[]
  transactions: Transaction[]
  isLoading: boolean
  // handleGetTypeTransaction: (typeTransactionId: string) => TypeTransaction | undefined
  handleFindCategoriesByTypeTransactionName: (typeTransactionName: string) => Promise<FindCategoriesResult>
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
  const [typeTransactions, setTypeTransactions] = useState<TypeTransaction[]>([])
  const [categoriasByTypeTransactions, setCategoriasByTypeTransactions] = useState<Category[]>([])
  
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useContext(AuthContext) as AuthContextType

  // init type transactions
  useEffect(() => {
    if(typeof token !== 'string' || token.length === 0) {
      return
    }
    findTypeTransactions(token)().then(result => {
      if(!result.error && result.data) {
        setTypeTransactions(result.data)
      }
    })
  }, [token])

  // init categories form 
  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      // income categories
      let typeTransactionName = 'income' as TypeTransactionName
      let result = await findCategoriesByTypeTransaction(token)(typeTransactionName)
      if (result.data) {
        setAllCategories(result.data)
        setCategoriasByTypeTransactions(result.data)
      }

      // expense categories
      typeTransactionName = 'expense' as TypeTransactionName
      result = await findCategoriesByTypeTransaction(token)(typeTransactionName)
      if (result.data !== undefined) {
        setAllCategories(prev => [...prev, ...result.data!])
      }
    })()

  }, [token])

  const handleFindTransactions = useCallback(async () => {
    if (typeof token !== 'string' || token.length === 0) {
      return
    }

    try {
      setIsLoading(true)
      const result = await findTransactions(token)()
      debugger
      if (!result.error && result.data) {
        setTransactions(result.data)
      }
    } catch {

    } finally {
      setIsLoading(false)
    }
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

  const handleFindCategoriesByTypeTransactionName = useCallback(
    async (typeTransactionName: string): Promise<FindCategoriesResult> => {
      let findCategoryResult: FindCategoriesResult

      try {
        setIsLoading(true)
        const result = await findCategoriesByTypeTransaction(token)(typeTransactionName)
        findCategoryResult = {
          message: result.message,
          sucess: !result.error
        }
        if (result.data) {
          setCategoriasByTypeTransactions(result.data)
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
      categoriasByTypeTransactions,
      allCategories,
      typeTransactions,
      transactions,
      isLoading,
      handleFindCategoriesByTypeTransactionName,
      handleInsertTransaction,
      handleFindTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
}
