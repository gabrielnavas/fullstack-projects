import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formattedDateAndTime = (date: Date): string => {
  const formattedDate = format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  return formattedDate
}