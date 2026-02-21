import { startOfMonth, endOfMonth, format } from 'date-fns';

export const generateInvoiceId = () => {
  return format(new Date(), "'INV-'yyyyMMdd-HHmmss");
};

export const getFirstDay = () => {
  const result = startOfMonth(new Date());
  return format(result, 'yyyy-MM-dd');
};

export const getLastDay = () => {
  const result = endOfMonth(new Date());
  return format(result, 'yyyy-MM-dd');
};

export const today = () => {
    return format(new Date(),"yyyy-MM-dd")
}