import { parseCurrencyToDecimal } from '@/lib/strings';
import { z } from 'zod'


export const formSchemaAmount = z.preprocess(value => {
  if (typeof value === 'string') {
    const formatedCurrency = parseCurrencyToDecimal(value, 'en-US')
    return formatedCurrency;
  }
  return value; // Caso não seja string, retorna 0
},
  z.number({
    invalid_type_error: 'opa',
    required_error: 'O valor é requerido.',
  }).max(999_999_999.99, 'O valor máximo é de R$ 999.999.999,00')
    .min(0.01, { message: "O valor deve ser no mínimo R$ 0,01" })
)

export const formSchemaDescriptionMax = 500

export const formSchemaDescription =  z.string()
.min(5, 'A descrição deve ter mínimo 5 caracteres.')
.max(formSchemaDescriptionMax, 'A descrição deve ter no máximo 500 caracteres.')

export const formSchemaTypeTransactionName = z.string().min(1, 'Selecione o tipo de transação')
export const formSchemaCategoryId = z.string().min(1, 'Selecione a categoria')

export const formSchema = z.object({
  amount: formSchemaAmount,
  description: formSchemaDescription,
  typeTransactionName:formSchemaTypeTransactionName,
  categoryId: formSchemaCategoryId,
});

export type FormSchema = z.infer<typeof formSchema>