"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

export type DatePickerRange = {} & DateRange

type Props = {
  title: string,
  date?: {
    from: Date
    to: Date
  }
  defaultMonth?: Date
  getRangeDate: (date?: DatePickerRange) => void
} & React.HTMLAttributes<HTMLDivElement>

export function DatePickerWithRange({
  className,
  title,
  defaultMonth,
  date,
  getRangeDate
}: Props) {

  const handleSetDate = React.useCallback((date?: DatePickerRange) => {
    getRangeDate(date)
  }, [getRangeDate])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{title}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            defaultMonth={defaultMonth ? defaultMonth : date?.from}
            mode="range"
            selected={date}
            onSelect={handleSetDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}