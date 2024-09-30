import { z } from 'zod'

import { parseCurrencyToDecimal } from '@/lib/strings';

import { formSchemaDescriptionMax } from '../form/transaction-form-schema';

const formSchemaAmount = z.preprocess(value => {
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
)

export const formSearchSchema = z.object({
  amountMin: formSchemaAmount,
  amountMax: formSchemaAmount,
  description: z.string().max(formSchemaDescriptionMax, 'A descrição deve ter no máximo 500 caracteres.'),
  typeTransactionName:  z.string().max(100, 'Categoria muito longa'),
  categoryId: z.string().max(100, 'Categoria muito longa'),
});

export type FormSearchSchema = z.infer<typeof formSearchSchema>