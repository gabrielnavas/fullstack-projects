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
import { deleteTransactionById } from "@/services/delete-transaction-by-id";
import { updateTransaction } from "@/services/update-transaction";

type FindCategoriesResult = {
  sucess: boolean,
  message: string,
}

export type TransactionContextType = {
  categoriasByTypeTransactions: Category[]
  typeTransactions: TypeTransaction[]
  allCategories: Category[]

  transactionPageSizeOptions: number[]
  transactions: TransactionsPagination
  previousPage: () => void
  nextPage: () => void
  setCurrentPage: (page: number)  => void
  setTransactionPageSize: (size: number) => void

  isLoading: boolean
  handleFindCategoriesByTypeTransactionName: (typeTransactionName: string) => Promise<FindCategoriesResult>
  handleInsertTransaction: (data: TransactionParams) => Promise<boolean>
  handleFindTransactions: (params: FindTransactionsParams) => void
  handleRemoveTransaction: (transactionId: string) => Promise<boolean>
  handleUpdateTransaction: (transactionId: string, params: TransactionParams) => Promise<boolean>
}

export const TransactionContext = createContext<TransactionContextType | null>(null)

type Props = {
  children: React.ReactNode
}

type TransactionsPagination = {
  data: Transaction[]
  currentPage: number
  totalItems: number
  totalPages: number
  pageSize: number
}

type TransactionParams = {
  amount: number;
  categoryId: string;
  description: string;
  typeTransactionName: string;
}

export const TransactionContextProvider: FC<Props> = ({ children }) => {
  const [typeTransactions, setTypeTransactions] = useState<TypeTransaction[]>([])
  const [
    categoriasByTypeTransactions, 
    setCategoriasByTypeTransactions
  ] = useState<Category[]>([])

  const [allCategories, setAllCategories] = useState<Category[]>([])

  const [
    transactionPageSizeOptions
  ] = useState([10, 20, 50, 100])

  const [transactions, setTransactions] = useState<TransactionsPagination>({
    currentPage: 0,
    data: [],
    totalItems: 0,
    totalPages: 0,
    pageSize: transactionPageSizeOptions[0],
  })

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
  

  const previousPage = useCallback(() => {
    setTransactions(prev=> ({
      ...prev,
      currentPage: prev.currentPage - 1,
    }))
  }, [])

  const nextPage = useCallback(() => {
    setTransactions(prev=> ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }))
  }, [])

  const setCurrentPage = useCallback((page: number) => {
    setTransactions(prev=> ({
      ...prev,
      currentPage: page,
    }))
  }, [])

  const setTransactionPageSize = useCallback((size: number) => {
    setTransactions(prev=> ({
      ...prev,
      pageSize: size,
    }))
  }, [])

  const handleFindTransactions = useCallback(async (params: FindTransactionsParams) => {
    if (typeof token !== 'string' || token.length === 0) {
      return
    }

    try {
      setIsLoading(true)
      const result = await findTransactions(token)(params)
      if (!result) {
        toast({
          title: 'Oops!',
          description: 'Tente novamente mais tarde',
        })
        return
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
      } else if (!result.data) {
        toast({
          title: result.message,
          description: 'Tente novamente mais tarde',
        })
      } else if (!result.data) {
        toast({
          title: 'Oops!',
          description: 'Tente novamente mais tarde',
        })
      } else {
        setTransactions({
          currentPage: result.data.currentPage,
          data: result.data.transactions,
          totalItems: result.data.totalItems,
          totalPages: result.data.totalPages,
          pageSize: params.pageSize || 0,
        })
      }
    } catch {

    } finally {
      setIsLoading(false)
    }
  }, [token, toast, route, handleSignOut])

  const handleRemoveTransaction = useCallback(
    async (transactionId: string): Promise<boolean> => {
      if (typeof token !== 'string' || token.length === 0) {
        return false
      }
      if (typeof transactionId !== 'string' || transactionId.length === 0) {
        return false
      }

      let success = true

      try {
        setIsLoading(true)
        const result = await deleteTransactionById(token)(transactionId)
        if (result.isUnauthorized) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde.',
          })
          route.replace('/signin')
          success = false;
        } else if (result.error) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde.',
          })
          success = false;
        } else {
          toast({
            title: "Removido!",
          })
          await handleFindTransactions({})
        }
      } catch {
        success = false;
      } finally {
        setIsLoading(false)
        return success
      }
    }, [token, toast, handleFindTransactions, route])

  const handleInsertTransaction = useCallback(
    async (data: TransactionParams): Promise<boolean> => {
      let success = true
      setIsLoading(true)
      try {
        const result = await insertTransaction(token)(data)
        if (result.isUnauthorized) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
          route.replace('/signin')
          handleSignOut()
          success = false
        } else if (result.error) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
          success = false
        }
        else {
          toast({
            title: "Transação realizada!",
            duration: 5000,
          })
          await handleFindTransactions({
            page: transactions.currentPage,
            pageSize: transactions.pageSize,
          })
        }
      } catch {
        toast({
          title: 'Ooops! algo aconteceu',
          duration: 5000,
        })
        success = false
      } finally {
        setIsLoading(false)
        return success
      }

    }, [token, handleFindTransactions, handleSignOut, route, toast,
      transactions.pageSize, 
      transactions.currentPage])

  const handleUpdateTransaction = useCallback(
    async (transactionId: string, params: TransactionParams):
      Promise<boolean> => {
      let success = true
      setIsLoading(true)

      let typeTransactionId = ''

      try {
        const typeTransactionsResult = await findTypeTransactions(token)()
        if (typeTransactionsResult.error || !typeTransactionsResult.data) {
          toast({
            title: 'Ooops! algo aconteceu',
            duration: 5000,
          })
          return false
        }
        const typeTransactions = typeTransactionsResult.data.filter(
          typeTransaction => typeTransaction.name === params.typeTransactionName
        )
        if (typeTransactions.length === 0) {
          toast({
            title: 'Ooops! algo aconteceu',
            duration: 5000,
          })
          return false
        } else {
          typeTransactionId = typeTransactions[0].id
        }
      }
      catch {
        setIsLoading(false)
        toast({
          title: 'Ooops! algo aconteceu',
          duration: 5000,
        })
        return false
      }


      try {
        const result = await updateTransaction(token)(transactionId, {
          amount: params.amount,
          categoryId: params.categoryId,
          description: params.description,
          typeTransactionId
        })
        if (result.isUnauthorized) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
          route.replace('/signin')
          handleSignOut()
          success = false
        } else if (result.error) {
          toast({
            title: result.message,
            description: 'Tente novamente mais tarde',
          })
          success = false
        }
        else {
          toast({
            title: "Transação realizada!",
            duration: 5000,
          })
          await handleFindTransactions({})
        }
      } catch {
        toast({
          title: 'Ooops! algo aconteceu',
          duration: 5000,
        })
        success = false
      } finally {
        setIsLoading(false)
        return success
      }

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
      
      setTransactionPageSize,
      transactionPageSizeOptions,
      transactions,
      previousPage,
      nextPage,
      setCurrentPage,

      isLoading,
      handleFindCategoriesByTypeTransactionName,
      handleInsertTransaction,
      handleFindTransactions,
      handleRemoveTransaction,
      handleUpdateTransaction,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}
