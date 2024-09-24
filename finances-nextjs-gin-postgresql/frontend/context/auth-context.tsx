'use client'

import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/services/signin";
import { useRouter } from "next/navigation";
import React, { createContext, FC, useCallback, useEffect, useState } from "react";

export type AuthContextType = {
  token: string
  isLoading: boolean
  handleSignIn: (email: string, password: string) => void
  handleSignOut: () => void
  isAuthenticated: () => boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
  children: React.ReactNode
}

const TOKEN_KEY = "token"

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const route = useRouter()

  useEffect(() =>  setToken(localStorage.getItem(TOKEN_KEY) || ""), [])

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn({ email, password })
      if (result.error) {
        toast({
          title: 'Ooops...! Algo aconteceu!',
          description: result.message,
          variant: 'destructive',
        })
      } else {
        if (result.data) {
          const token = result.data
          setToken(token)
          localStorage.setItem(TOKEN_KEY, token)
          route.push("/dashboard")
        } else {
          toast({
            title: 'Bem-vindo(a)',
            description: result.message,
          })
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Ooops...! Algo aconteceu!',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [route, toast])

  const isAuthenticated = useCallback(() => {
    return token !== ""
  }, [token])

  const handleSignOut = useCallback(() => {
    setToken("")
    localStorage.clear()
    toast({
      title: 'Até mais!',
      description: 'Volte sempre',
      duration: 5000
    })
    route.push("/signin")
  }, [route, toast])

  return (
    <AuthContext.Provider value={{
      token, isLoading, handleSignIn, isAuthenticated, handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
