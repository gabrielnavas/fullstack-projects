import { ProductTable } from "@/components/products/product-table";
import TableProvider from "@/context/product-context";

export default function Home() {
  return (
    <div className="w-[100%]">
      <TableProvider>
        <ProductTable />
      </TableProvider>
    </div>
  )
}
