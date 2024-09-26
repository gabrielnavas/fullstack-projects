import { AuthContext, AuthContextType } from "@/context/auth-context";
import { findCategories } from "@/services/find-category";
import { Category } from "@/services/models";

import { FC, useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "@/hooks/use-toast";

export const CategoryTable: FC = () => {
  const { token } = useContext(AuthContext) as AuthContextType

  const [categories, setCategories] = useState<Category[]>([])

  const {toast} = useToast()

  useEffect(() => {
    const handleFindCategories = async () => {
      if (!token || token.length === 0) {
        return
      }

      const result = await findCategories(token)()
      if(result.data) {
        setCategories(result.data)
      } else {
        toast({
          title: "Ooops! Algo aconteceu!",
          description: result.message,
        })
      }
    }
    handleFindCategories()
  }, [token, toast])

  return (
    <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Nome</TableHead>
        <TableHead className="text-right">Descrição</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
    {categories && categories.map(category => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-right">{category.description}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
  );
}
