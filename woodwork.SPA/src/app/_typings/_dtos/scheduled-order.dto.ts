import type { OrderEntity } from '../order.typings';

export type ScheduledOrderDTO<T extends OrderEntity> = {
  componentsAvailability: Array<ComponentAvailability<T>>;
  id: string;
  createdInvoice: CreatedInvoice;
};

export type ComponentAvailability<T extends OrderEntity> = {
  component: T;
  isAvailable: boolean;
};

type CreatedInvoice = {
  id: string;
};
