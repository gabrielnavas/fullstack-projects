import { z } from 'zod'
import {
  formSchemaAmount, formSchemaCategoryId,
  formSchemaDescriptionMax,
  formSchemaTypeTransactionName
} from '../form/transaction-form-schema';

export const formSearchSchemaDescription = z.string()
  .min(1, 'A descrição deve ter mínimo 5 caracteres.')
  .max(formSchemaDescriptionMax, 'A descrição deve ter no máximo 500 caracteres.')

export const formSearchSchema = z.object({
  amountMin: formSchemaAmount,
  amountMax: formSchemaAmount,
  description: formSearchSchemaDescription,
  typeTransactionName: formSchemaTypeTransactionName,
  categoryId: formSchemaCategoryId,
});

export type FormSearchSchema = z.infer<typeof formSearchSchema>