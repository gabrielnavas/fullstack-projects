'use client'

import { findCategories, findCategoriesByTypeTransaction } from "@/services/find-category";
import { Category, Transaction, TypeTransaction } from "@/services/models";
import React, { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./auth-context";
import { insertTransaction } from "@/services/insert-transaction";
import { findTransactions, FindTransactionsParams } from "@/services/find-transactions";
import { findTypeTransactions } from "@/services/find-type-transactions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
  handleFindTransactions: (params: FindTransactionsParams) => void
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

  const { token, handleSignOut } = useContext(AuthContext) as AuthContextType

  const { toast } = useToast()
  const route = useRouter()

  // init type transactions
  useEffect(() => {
    if (typeof token !== 'string' || token.length === 0) {
      return
    }
    findTypeTransactions(token)().then(result => {
      if (result.isUnauthorized) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
        route.replace('/signin')
        handleSignOut()
      } else if (result.error) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else if (!result.data) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else {
        setTypeTransactions(result.data)
      }
    })
  }, [token, handleSignOut, route, toast])

  // init All Categories 
  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      const result = await findCategories(token)()
      if (result.isUnauthorized) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
        route.replace('/signin')
        handleSignOut()
      } else if (result.error) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else if (!result.data) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else {
        setAllCategories(result.data)
      }
    })()
  }, [token, route, toast, handleSignOut])

  // init Categories By Type Transaction
  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      // categories by type transaction income 
      const result = await findCategoriesByTypeTransaction(token)('income')
      if (result.isUnauthorized) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
        route.replace('/signin')
        handleSignOut()
      } else if (result.error) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else if (!result.data) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else {
        setCategoriasByTypeTransactions(result.data)
      }
    })()

  }, [token, route, toast, handleSignOut])

  const handleFindTransactions = useCallback(async (params: FindTransactionsParams) => {
    if (typeof token !== 'string' || token.length === 0) {
      return
    }

    try {
      setIsLoading(true)
      const result = await findTransactions(token)(params)

      if (result.isUnauthorized) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
        route.replace('/signin')
        handleSignOut()
      } else if (result.error) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else if (!result.data) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else {
        setTransactions(result.data)
      }
    } catch {

    } finally {
      setIsLoading(false)
    }
  }, [token, toast, route, handleSignOut])


  const handleInsertTransaction = useCallback(async (data: InserTransaction): Promise<InsertTransactionResult> => {
    setIsLoading(true)
    let insertResult: InsertTransactionResult
    try {
      const result = await insertTransaction(token)(data)
      insertResult = {
        message: result.message || 'Oops!',
        success: !result.error
      }
      if (result.isUnauthorized) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
        route.replace('/signin')
        handleSignOut()
      } else if (result.error) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      }
      else if (!insertResult.success) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else {
        await handleFindTransactions({})
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

  }, [token, handleFindTransactions, handleSignOut, route, toast])

  const handleFindCategoriesByTypeTransactionName = useCallback(
    async (typeTransactionName: string): Promise<FindCategoriesResult> => {
      let findCategoryResult: FindCategoriesResult

      try {
        setIsLoading(true)
        const result = await findCategoriesByTypeTransaction(token)(typeTransactionName)
        findCategoryResult = {
          message: result.message || 'Ooops!',
          sucess: !result.error
        }
        if (result.isUnauthorized) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
          route.replace('/signin')
          handleSignOut()
        } else if (result.error) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
        }
        else if (!result.data) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
        } else {
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
    }, [token, handleSignOut, route, toast])


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
