import TableProvider from "@/components/products/context/product-context";
import { ProductTable } from "@/components/products/product-table";

export default function Home() {
  return (
    <div className="w-[100%]">
      <TableProvider>
        <ProductTable />
      </TableProvider>
    </div>
  )
}
