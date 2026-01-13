import { v4 as uuidv4 } from 'uuid';

export const generateBookingNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK${year}${month}${random}`;
};

export const generatePaymentNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PAY${year}${month}${random}`;
};

export const generateTicketNumber = (): string => {
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `TK${random}`;
};

export const calculateDays = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-SY', {
    style: 'currency',
    currency: 'SYP',
    minimumFractionDigits: 0,
  }).format(price);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

export const generateVerificationToken = (): string => {
  return uuidv4();
};
