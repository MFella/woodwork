import type { AbstractControl } from '@angular/forms';

export const orderEntities = [
  'Lumber',
  'Beam',
  'Joist',
  'Plywood',
  'Door',
] as const;

export type OrderEntity = (typeof orderEntities)[number];

export type OrderFormActions = 'add' | 'remove';

export type OrderRecord = {
  name: OrderEntity | null;
  count: number | null;
};

export type OrderRecordFormGroup = {
  [Key in keyof OrderRecord]: AbstractControl<OrderRecord[Key]>;
};
