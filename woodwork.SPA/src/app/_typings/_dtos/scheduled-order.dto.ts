import type { OrderEntity } from '../order.typings';

export type ScheduledOrderDTO<T extends OrderEntity> = {
  componentsAvailability: Array<ComponentAvailability<T>>;
  id: string;
  createdInvoice: CreatedInvoice;
  orderStatus: `${TransactionStatus}`;
};

export type ComponentAvailability<T extends OrderEntity> = {
  component: T;
  isAvailable: boolean;
};

type CreatedInvoice = {
  id: string;
  transactionStatus: `${TransactionStatus}`;
};

enum TransactionStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}
