import { z } from 'zod'

export type FormSchemaType = z.infer<typeof formSchema>

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().min(10, { message: "Description should be at least 10 characters" }),
  price: z.preprocess((v) => parseFloat(v as string), z.number().min(0.01, { message: "Value min must be 0.01" })),
  quantity: z.preprocess((v) => parseInt(v as string), z.number().positive({ message: "Quantity should be a positive number" })),
}); 