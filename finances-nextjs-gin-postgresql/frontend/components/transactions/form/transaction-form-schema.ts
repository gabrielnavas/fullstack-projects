import { parseCurrencyToDecimal } from '@/utils/strings';
import { z } from 'zod'

export const amountSchema = z.preprocess(value => {
  if (typeof value === 'string') {
    const formatedCurrency = parseCurrencyToDecimal(value, 'en-US')
    return formatedCurrency;
  }
  return 0; // Caso não seja string, retorna 0
},
  z.number({
    required_error: 'O valor é requerido.',
  }).max(999_999_999.99, 'O valor máximo é de 999.999.999,00')
    .min(0.01, { message: "O valor deve ser no mínimo 0.01" })
)

export const formSchema = z.object({
  amount: amountSchema,
  description: z.string()
    .min(5, 'A descrição deve ter mínimo 5 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  typeTransactionName: z.string().min(1, 'Selecione o tipo de transação'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
});

export type FormSchema = z.infer<typeof formSchema>