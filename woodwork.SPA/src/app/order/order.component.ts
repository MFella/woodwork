import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  orderEntities,
  type OrderEntity,
  type OrderFormActions,
  type OrderFormGroup,
} from '../_typings/order.typings';
import { RestService } from '../_services/rest.service';
import type { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { AlertService } from '../alert.service';
import type { OrderToScheduleDto } from '../_typings/_dtos/order-to-schedule.dto';

@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnInit {
  private static readonly PROGRESS_FINISHED_THRESHOLD = 100;
  readonly MAX_RESOURCE_COUNT = 99999;
  readonly MIN_RESOURCE_COUNT = 1;
  private readonly restService = inject(RestService);
  private readonly alertService = inject(AlertService);

  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  private sendOrderSubscription?: Subscription;
  allOrderFields: Set<OrderEntity> = new Set<OrderEntity>(orderEntities);
  pickedOrderFieldsMap: Map<OrderEntity, number> = new Map([['Beam', 1]]);
  availableOrderFields: Set<OrderEntity> = new Set<OrderEntity>();
  areSomeValuesIncorrect = false;

  // orderFormGroup: FormGroup<OrderFormGroup> = new FormGroup<OrderFormGroup>({
  //   Beam: new FormControl(),
  //   Door: new FormControl(),
  //   Joist: new FormControl(),
  //   Lumber: new FormControl(),
  //   Plywood: new FormControl(),
  // });

  canAddOrderField = true;
  canSubtractOrderField = false;
  isRequestPended = false;
  progressOfRequest = 0;

  ngOnInit(): void {
    this.updateAvailableOrderFields();
    this.#changeDetectorRef.detectChanges();
  }

  addOrderField(): void {
    this.allOrderFields.add('Beam');

    this.canAddOrderField =
      this.pickedOrderFieldsMap.size !== this.allOrderFields.size;
  }

  toggleOrderField(action: OrderFormActions, orderEntity?: OrderEntity): void {
    switch (action) {
      case 'add':
        {
          const pickedOrderFieldsArr = Array.from(
            this.pickedOrderFieldsMap.keys()
          );
          const formFieldToAdd = Array.from(this.allOrderFields)
            .filter(
              orderField => pickedOrderFieldsArr.indexOf(orderField) === -1
            )
            .at(0);
          this.pickedOrderFieldsMap.set(formFieldToAdd as OrderEntity, 1);
          this.updateAvailableOrderFields();
        }
        break;
      case 'remove':
        {
          if (!orderEntity) {
            console.error('Order entity is not provided');
            return;
          }
          this.pickedOrderFieldsMap.delete(orderEntity);
          this.updateAvailableOrderFields();
        }
        break;
      default:
        {
          console.error(`Not implemented action: ${action}`);
        }
        break;
    }

    this.canAddOrderField =
      this.pickedOrderFieldsMap.size !== this.allOrderFields.size;
    this.canSubtractOrderField = this.pickedOrderFieldsMap.size > 1;
    this.#changeDetectorRef.detectChanges();
  }

  selectOptionChanged(
    eventTarget: EventTarget | null,
    previousOrderEntity: OrderEntity,
    selectElement: HTMLSelectElement
  ): void {
    if (eventTarget === null || !('value' in eventTarget)) {
      console.log('Cannot assign - eventTarget is null');
      return;
    }

    const previousOrderEntityCount =
      this.pickedOrderFieldsMap.get(previousOrderEntity);
    if (!previousOrderEntityCount) {
      return;
    }

    const indexOfPreviousValue = Array.from(
      this.pickedOrderFieldsMap.keys()
    ).indexOf(previousOrderEntity);
    this.pickedOrderFieldsMap.delete(previousOrderEntity);

    if (indexOfPreviousValue === -1) {
      console.error('Cannot find previous value');
      return;
    }
    const pickedOrderFieldsArray = Array.from(this.pickedOrderFieldsMap);
    pickedOrderFieldsArray.splice(indexOfPreviousValue, 0, [
      eventTarget.value as OrderEntity,
      previousOrderEntityCount,
    ]);
    this.pickedOrderFieldsMap = new Map(pickedOrderFieldsArray);

    this.updateAvailableOrderFields();
    selectElement.selectedIndex = 0;
    this.#changeDetectorRef.detectChanges();
  }

  updateAvailableOrderFields(): void {
    const pickedOrderFieldsArr = Array.from(this.pickedOrderFieldsMap.keys());
    this.availableOrderFields = new Set(
      Array.from(this.allOrderFields).filter(
        field => !pickedOrderFieldsArr.includes(field)
      )
    );
    this.#changeDetectorRef.detectChanges();
  }

  sendOrder(): void {
    const orderItems = Object.fromEntries(
      this.pickedOrderFieldsMap.entries()
    ) satisfies OrderToScheduleDto;

    // if there are some form violations - display error banner
    if (
      Object.values(orderItems).some(
        count =>
          count > this.MAX_RESOURCE_COUNT || count < this.MIN_RESOURCE_COUNT
      )
    ) {
      this.alertService.showError(
        `Correct form! Min value: ${this.MIN_RESOURCE_COUNT}, Max value: ${this.MAX_RESOURCE_COUNT}`
      );
      return;
    }

    // request in progress - do not trigger another time
    if (this.sendOrderSubscription) {
      return;
    }

    this.isRequestPended = true;

    this.sendOrderSubscription = this.restService
      .scheduleOrder(orderItems)
      .subscribe(value => {
        this.progressOfRequest = value.progress;
        if (
          this.progressOfRequest >= OrderComponent.PROGRESS_FINISHED_THRESHOLD
        ) {
          this.sendOrderSubscription?.unsubscribe();
          this.sendOrderSubscription = undefined;
          this.isRequestPended = false;
        }

        this.#changeDetectorRef.detectChanges();
      });
  }

  cancelOrder(): void {
    if (!this.sendOrderSubscription) {
      return;
    }

    this.sendOrderSubscription.unsubscribe();
    this.sendOrderSubscription = undefined;
    this.isRequestPended = false;
    this.progressOfRequest = 0;
  }

  updateCountValue(
    orderEntity: OrderEntity,
    eventTarget: EventTarget | null
  ): void {
    if (eventTarget === null || !('value' in eventTarget)) {
      console.log('Cannot assign - eventTarget is null');
      return;
    }

    const orderEntityCountFromMap = this.pickedOrderFieldsMap.get(orderEntity);
    if (orderEntityCountFromMap === undefined) {
      return;
    }

    const parsedValue = parseInt(eventTarget.value as string);
    if (!isNaN(parsedValue)) {
      this.pickedOrderFieldsMap.set(orderEntity, parsedValue);
    }

    this.areSomeValuesIncorrect = Array.from(
      this.pickedOrderFieldsMap.values()
    ).some(
      value =>
        value > this.MAX_RESOURCE_COUNT || value < this.MIN_RESOURCE_COUNT
    );

    this.#changeDetectorRef.detectChanges();
  }
}
