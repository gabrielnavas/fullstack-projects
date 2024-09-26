import {z} from 'zod'
import { formSchemaAmount, formSchemaCategoryId, formSchemaDescription, formSchemaTypeTransactionName } from '../form/transaction-form-schema';

export const formSearchSchema = z.object({
  amountMin: formSchemaAmount,
  amountMax: formSchemaAmount,
  description: formSchemaDescription,
  typeTransactionName: formSchemaTypeTransactionName,
  categoryId: formSchemaCategoryId,
});

export type FormSearchSchema = z.infer<typeof formSearchSchema>