"use client"

import { useRouter } from "next/navigation";

import React from "react";

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

export const AuthContext = React.createContext<AuthContextType | null>(null)

type Props = {
  children: React.ReactNode
}

const TOKEN_KEY = "token"
const USER_KEY = "user"

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = React.useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)

  const route = useRouter()

  React.useLayoutEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = localStorage.getItem(USER_KEY)
    if (token && user) {
      setToken(token)
      setUser(JSON.parse(user))
      setIsAuthenticated(true)
    }
  }, [])

  const handleSignin = React.useCallback((token: string, user: User) => {
    if (token.length > 0) {
      setToken(token)
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  }, [])

  const handleToggleIsLoading = React.useCallback(() => {
    setIsLoading(prev => !prev)
  }, [])

  const handleLogout = React.useCallback(() => {
    setToken('')
    setIsAuthenticated(false)
    localStorage.clear()
  }, [])

  const isAuthCheck = React.useCallback((): void => {
    if (isAuthenticated) {
      route.replace("/feed")
    }
  }, [isAuthenticated, route])

  const isNotAuthCheck = React.useCallback((): void => {
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

