import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, timer, type Observable } from 'rxjs';
import type { OrderToScheduleDto } from '../_typings/_dtos/order-to-schedule.dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly _httpClient = inject(HttpClient);

  scheduleOrder(
    _orderToScheduleDto: OrderToScheduleDto
  ): Observable<Record<'progress', number>> {
    // return this.httpClient.post(`${this.getBackendUrl()}/order/schedule`, { components: orderToScheduleDto });
    return timer(0, 1000).pipe(map(value => ({ progress: value * 10 })));
  }

  private getBackendUrl(): string {
    return environment.backendUrl;
  }
}
