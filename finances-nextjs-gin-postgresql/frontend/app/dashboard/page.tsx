'use client'

import { AuthContext, AuthContextType } from "@/context/auth-context"
import { sumAmountGroupByCategory, SumAmountGroupByCategoryResult } from "@/services/sum-transaction-amount-group-by-category"
import { subDays } from "date-fns"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

const DashboardPage: React.FC = () => {

  const {token, isAuthenticated} = useContext(AuthContext) as AuthContextType

  const route = useRouter()

  const [items, setItems ] = useState<SumAmountGroupByCategoryResult[]>([])
  
  useEffect(() => {
    if(!isAuthenticated) {
      route.replace("/signin")
    }
  }, [isAuthenticated, route])

  useEffect(() => {
    (async () => {
      if(typeof token !== 'string' || token.length === 0) {
        return
      }

      const now = new Date()
      const result = await sumAmountGroupByCategory(token)({
        createdAtFrom: subDays(now, 1),
        createdAtTo: now,
        typeTransactionName: 'income'
      })
      setItems(result.data!)
    })()
  }, [token])

  return (
    <div className="w-full">
      dashboard
      {items.map(item => (
        <div key={item.categoryName}>{item.categoryName}{' - '}{item.sum}</div>
      ))}
      </div>
  )
}

export default DashboardPage