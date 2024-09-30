import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown, Filter, FilterX } from "lucide-react";
import React from "react";

type CollapsibleSearchFormProps = {
  reset: () => void
  children: React.ReactNode
}

const CollapsibleSearchForm = ({
  reset,
  children,
}: CollapsibleSearchFormProps) => {
  const [isOpenSearchForm, setIsOpenSearchForm] = React.useState(false)

  React.useEffect(() => {
    const isOpen = localStorage.getItem('transaction-form-search-open')
    setIsOpenSearchForm(isOpen === 'open')
  }, [])
  const handleIsOpen = React.useCallback(() => {
    const state = !isOpenSearchForm
    localStorage.setItem('transaction-form-search-open', state
      ? 'open'
      : 'closed')
    setIsOpenSearchForm(state)
  }, [setIsOpenSearchForm, isOpenSearchForm])

  const handleResetForm = React.useCallback(() => {
    if (isOpenSearchForm) {
      reset()
      handleIsOpen()
    }
  }, [reset, handleIsOpen, isOpenSearchForm])

  return (
    <Collapsible
      open={isOpenSearchForm}
      onOpenChange={handleIsOpen}
    >
      <div className="flex">
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => handleResetForm()}
            size="sm"
            className="w-[200px] font-semibold gap-2">
            <div className="flex items-center gap-2">
              {isOpenSearchForm
                ? (
                  <>
                    <FilterX className="font-semibold text-red-500" />
                    <span className="font-semibold text-red-500">Cancelar filtros</span>
                  </>
                )
                : (
                  <>
                    <Filter />
                    <span>Filtrar as transações</span>
                  </>
                )}
            </div>
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export { CollapsibleSearchForm }