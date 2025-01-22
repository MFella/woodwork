import type { OrderEntity } from '../order.typings';

export type OrderToScheduleDto = Partial<{
  [Key in OrderEntity]: number;
}>;
