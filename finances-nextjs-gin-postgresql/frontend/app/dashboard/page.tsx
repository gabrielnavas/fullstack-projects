'use client'

import React, { useContext, useEffect } from "react"

import { AuthContext, AuthContextType } from "@/context/auth-context"
import { useRouter } from "next/navigation"

const DashboardPage: React.FC = () => {
  const { token, isAuthenticated } = useContext(AuthContext) as AuthContextType

  const route = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      route.replace("/signin")
    }
  }, [isAuthenticated, route])

  return (
    <div>{token}</div>
  )
}

export default DashboardPage