"use client"

import { useRouter } from "next/navigation";
import React, { createContext, FC, useCallback, useLayoutEffect, useState } from "react";

export type AuthContextType = {
  token: string
  isLoading: boolean
  handleToggleIsLoading: () => void
  user: User | null
  handleSignin: (token: string, user: User) => void
  handleLogout: () => void
  isAuthCheck: () => void
  isNotAuthCheck: () => void
}

type User = {
  username: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
  children: React.ReactNode
}

const TOKEN_KEY = "token"
const USER_KEY = "user"

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const route = useRouter()

  useLayoutEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = localStorage.getItem(USER_KEY)
    if(token && user) {
      setToken(token)
      setUser(JSON.parse(user))
      setIsAuthenticated(true)
    }
  }, [])

  const handleSignin = useCallback((token: string, user: User) => {
    if (token.length > 0) {
      setToken(token)
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  }, [])

  const handleToggleIsLoading = useCallback(() => {
    setIsLoading(prev => !prev)
  }, [])

  const handleLogout = useCallback(() => {
    setToken('')
    setIsAuthenticated(false)
    localStorage.clear()
  }, [])

  const isAuthCheck = useCallback((): void => {
    if (isAuthenticated) {
      route.replace("/feed")
    }
  }, [isAuthenticated, route])

  const isNotAuthCheck = useCallback((): void => {
    if (!isAuthenticated) {
      route.replace("/signin")
    }
  }, [isAuthenticated, route])

  return (
    <AuthContext.Provider value={{
      token,
      isLoading,
      handleToggleIsLoading,
      user,
      handleSignin,
      // isAuthenticated,
      handleLogout,
      isAuthCheck,
      isNotAuthCheck,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

