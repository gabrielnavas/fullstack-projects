'use client'

import {
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  AuthContext, AuthContextType
} from "@/context/auth-context"

import {
  sumAmountGroupByCategory,
  SumAmountGroupByCategoryResult
} from "@/services/sum-transaction-amount-group-by-category"


import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

import { DatePickerWithRange } from "@/components/form/date-picker"

import { useToast } from "@/hooks/use-toast"

import { findTypeTransactions } from "@/services/find-type-transactions"
import { TypeTransaction } from "@/services/models"
import { formatCurrency } from "@/lib/strings"
import { Label } from "@/components/ui/label"
import { RotateCwIcon } from "lucide-react"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

type Dates = {
  from: Date;
  to: Date;
} | undefined

const DashboardPage: React.FC = () => {

  const { token, isAuthenticated, handleSignOut } = useContext(AuthContext) as AuthContextType
  const route = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [typeTransactions, setTypeTransactions] = useState<TypeTransaction[]>([])
  const [typeTransaction, setTypeTransaction] = useState<TypeTransaction>(
    {} as TypeTransaction
  )

  const { toast } = useToast()

  const [
    amountsByCategoryItems, setAmountsByCategoryItems
  ] = useState<SumAmountGroupByCategoryResult[]>([])
  const [rangeDate, setRangeDate] = useState<Dates>({
    from: new Date(1970, 1, 1),
    to: new Date()
  })

  useEffect(() => {
    if (!isAuthenticated) {
      route.replace("/signin")
    }
  }, [isAuthenticated, route])


  // init type transactions
  useEffect(() => {
    if (typeof token !== 'string' || token.length === 0) {
      return
    }
    setIsLoading(true)
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
        if (typeof result.data === 'object' && result.data.length > 0) {
          setTypeTransaction(result.data[0])
        }
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }, [token, handleSignOut, route, toast])

  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }
      if (!rangeDate || !rangeDate.to) {
        return
      }
      if (!typeTransaction) {
        return
      }
      setIsLoading(true)
      try {
        const result = await sumAmountGroupByCategory(token)({
          createdAtFrom: rangeDate.from,
          createdAtTo: rangeDate.to,
          typeTransactionName: typeTransaction.name
        })
        if (result.data) {
          setAmountsByCategoryItems(result.data)
        }
      }
      catch {
        toast({
          title: 'Ooops!',
          description: 'Não foi possível obter ops dados de algumas transações',
        })
      }
      finally {
        setIsLoading(false)
      }
    })()
  }, [token, rangeDate, typeTransaction, toast])

  const handleSetRangeDates = useCallback((dates?: Dates) => {
    setRangeDate(dates)
  }, [])

  return (
    <Card className="m-4 w-full">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Monitoramento das transações</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Tipo de transação</Label>
            <Select
              value={typeTransaction.id}
              onValueChange={typeTransactionId => {
                const found = typeTransactions.filter(typeTransaction => (
                  typeTransaction.id === typeTransactionId
                ))
                setTypeTransaction(found[0])
              }}>
              <SelectTrigger className="w-[175px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {typeTransactions.map(typeTransaction => (
                    <SelectItem key={typeTransaction.name}
                      value={typeTransaction.id}>
                      {typeTransaction.displayName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Intervalo de datas</Label>
            <DatePickerWithRange
              defaultMonth={rangeDate?.to}
              date={rangeDate}
              getRangeDate={dateRange => handleSetRangeDates(dateRange as Dates)}
              title="Intervalo das datas"
            />
          </div>
        </div>

        {isLoading && (
          <RotateCwIcon className="animate-spin text-zinc-600 m-4" size={52} />
        )}
        {!isLoading && amountsByCategoryItems.length > 0 && (
          <ChartContainer className="h-[200px]" config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={amountsByCategoryItems}
              layout="vertical"
              barSize={45}
              barGap={5}
              barCategoryGap={5}
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="categoryName"
                type="category"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 40)}
                
              />
              <XAxis
                dataKey="sum"
                type="number"
                domain={['dataMin', 'auto']}
                tickFormatter={(value) => {
                  if (typeof value === 'number') {
                    const real = formatCurrency(value.toString(), 'pt-BR')
                    return real;
                  }
                  return value
                }}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { categoryName, sum } = payload[0].payload;
                    return (
                      <div className="flex flex-col font-semibold text-black bg-slate-50 p-4 rounded-xl">
                        <p>{`Categoria: ${categoryName}`}</p>
                        <p>{`Soma: ${formatCurrency((sum as number).toString(), 'pt-BR')}`}</p>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              <Bar
                dataKey="sum"
                layout="vertical"
                fill="var(--color-desktop)"
                radius={4}
              >
                {/* <LabelList
                  dataKey="categoryName"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={16}
                /> */}
                <LabelList
                  dataKey="sum"
                  position="right"
                  className="fill-foreground"
                  fontSize={16}
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      const real = formatCurrency(value.toString(), 'pt-BR')
                      return real;
                    }
                    return value
                  }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}


export default DashboardPage