import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, type Observable } from 'rxjs';
import type { OrderToScheduleDto } from '../_typings/_dtos/order-to-schedule.dto';
import { environment } from '../../environments/environment.development';
import type {
  ComponentAvailability,
  ScheduledOrderDTO,
} from '../_typings/_dtos/scheduled-order.dto';
import type { OrderEntity } from '../_typings/order.typings';

type RestDomain = 'order';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private static readonly FAKE_DELAY_TIME_OFFSET_MS = 2000;
  private readonly httpClient = inject(HttpClient);

  scheduleOrder<T extends OrderEntity>(
    orderToScheduleDto: OrderToScheduleDto<T>
  ): Observable<
    Pick<ScheduledOrderDTO<T>, 'componentsAvailability' | 'orderStatus'>
  > {
    return this.httpClient
      .post<ScheduledOrderDTO<T>>(
        `${this.getBackendUrl('order')}/schedule`,
        orderToScheduleDto
      )
      .pipe(
        delay(RestService.FAKE_DELAY_TIME_OFFSET_MS),
        map(scheduledOrderDTO => ({
          componentsAvailability: scheduledOrderDTO.componentsAvailability,
          orderStatus: scheduledOrderDTO.orderStatus,
        }))
      );
  }

  private getBackendUrl(domain: RestDomain): string {
    return `${environment.backendUrl}/${domain}`;
  }
}
