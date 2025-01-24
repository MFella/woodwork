import type { OrderEntity, OrderRecord } from '../order.typings';

export type OrderToScheduleDto<T extends OrderEntity> = {
  orderItems: Array<OrderRecord<T>>;
};
