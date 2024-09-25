'use client'

import { useToast } from "@/hooks/use-toast";
import { findCategories } from "@/services/find-category";
import { Category } from "@/services/models";
import React, { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./auth-context";
import { insertTransaction } from "@/services/insert-transaction";

export type TransactionContextType = {
  typeTransactionNames:  { name: string, displayName: string }[]
  categories: Category[]
  isLoading: boolean
  handleFindCategories: (typeTransactionName: string) => void
  handleInsertTransaction: (data: InserTransaction) => Promise<boolean> 
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

  const { toast } = useToast()

  // init first categories list
  useEffect(() => {
    (async () => {
      if (!token || token.length === 0) {
        return
      }
      if(!categories || categories.length > 0) {
        return 
      }

      const typeTransactionName = typeTransactionNames[0].name
      const result = await findCategories(token)(typeTransactionName!)
      if (result.data) {
        setCategories(result.data)
      }
    })()

  }, [token, typeTransactionNames, categories])

  const handleInsertTransaction = useCallback(async (data: InserTransaction): Promise<boolean> => {
    let success = false
    setIsLoading(true)
    try {
      const result = await insertTransaction(token)(data)
      if(result.error) {
        toast({
          title: "Ooops! Algo aconteceu",
          description: result.message
        })
      } else {
        toast({
          title: "Sucesso!",
          description: result.message
        })
        success = true
      }
    }catch {

    } finally {
      setIsLoading(false)
    }

    return success
  }, [token, toast])

  const handleFindCategories = useCallback(async (typeTransactionName: string) => {
    if (!token || token.length === 0) {
      return
    }

    const result = await findCategories(token)(typeTransactionName!)
    if (result.data) {
      setCategories(result.data)
    } else {
      toast({
        title: "Ooops! Algo aconteceu!",
        description: result.message,
      })
    }
  }, [token, toast])

  
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
