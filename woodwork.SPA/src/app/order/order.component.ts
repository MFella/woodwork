import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  type OnInit,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  type ValidatorFn,
} from '@angular/forms';
import {
  orderEntities,
  type OrderEntity,
  type OrderRecordFormGroup,
} from '../_typings/order.typings';
import { RestService } from '../_services/rest.service';
import { type Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { AlertService } from '../alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeUtil } from '../util/type-util';
import type { ComponentAvailability } from '../_typings/_dtos/scheduled-order.dto';
import type { RequestStatus } from '../_typings/common.typings';

const formErrorMessages = {
  min: 'Value is less than 1',
  max: 'Value is greater than 99999',
  required: 'Value is required',
} as const;

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
  readonly ORDER_FORM_COUNT_VALIDATORS: Array<ValidatorFn> = [
    Validators.required,
    Validators.min(this.MIN_RESOURCE_COUNT),
    Validators.max(this.MAX_RESOURCE_COUNT),
  ];
  readonly ORDER_FORM_NAME_VALIDATORS: Array<ValidatorFn> = [
    Validators.required,
  ];

  private readonly restService = inject(RestService);
  private readonly alertService = inject(AlertService);
  readonly #destroyRef = inject(DestroyRef);

  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  private sendOrderSubscription?: Subscription;
  allOrderFields: Set<OrderEntity> = new Set<OrderEntity>(orderEntities);
  availableOrderFields: Set<OrderEntity> = new Set<OrderEntity>();
  componentsAvailability: Map<OrderEntity, ComponentAvailability<OrderEntity>> =
    new Map();

  orderFormGroup: FormGroup = new FormGroup({
    components: new FormArray<FormGroup<OrderRecordFormGroup>>([
      new FormGroup<OrderRecordFormGroup>({
        name: new FormControl(
          'Beam' as OrderEntity,
          this.ORDER_FORM_NAME_VALIDATORS
        ),
        count: new FormControl(1, this.ORDER_FORM_COUNT_VALIDATORS),
      }),
    ]),
  });

  canAddOrderField = true;
  canSubtractOrderField = false;
  requestStatus?: RequestStatus;

  get isRequestPended(): boolean {
    return this.requestStatus === 'pending';
  }

  ngOnInit(): void {
    this.observeFormArrayValueChanged();
    this.observeFormArrayStatusChanged();
    this.updateAvailableOrderFields();
  }

  sendOrder(): void {
    const orderItems = this.getOrderFormComponents().value;

    if (!orderItems.every(x => TypeUtil.hasDefinedNonNullProps(x))) {
      console.error(
        'Cannot send order - some form fields are null or undefined'
      );
      return;
    }

    // if there are some form violations - display error banner
    if (
      Object.values(orderItems).some(
        orderItem =>
          orderItem.count! > this.MAX_RESOURCE_COUNT ||
          orderItem.count! < this.MIN_RESOURCE_COUNT
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

    this.requestStatus = 'pending';
    this.#changeDetectorRef.detectChanges();

    this.sendOrderSubscription = this.restService
      .scheduleOrder({ orderItems })
      .subscribe({
        next: componentsAvailability => {
          this.componentsAvailability = new Map(
            componentsAvailability.map(availability => [
              availability.component,
              availability,
            ])
          );
          this.requestStatus = 'success';
          this.#changeDetectorRef.detectChanges();
        },
        error: (error: unknown) => {
          if (TypeUtil.isKeyInUnknown(error, 'message')) {
            this.alertService.showError(error.message);
          }

          this.requestStatus = 'fail';
        },
      });
  }

  cancelOrder(): void {
    if (!this.sendOrderSubscription) {
      return;
    }

    this.sendOrderSubscription.unsubscribe();
    this.sendOrderSubscription = undefined;
    this.requestStatus = 'cancel';
  }

  addFormGroupComponent(): void {
    const firstAvailableComponentName = this.availableOrderFields
      .keys()
      .next().value;
    if (!firstAvailableComponentName) {
      console.error('Cannot add control');
      return;
    }

    this.availableOrderFields.delete(firstAvailableComponentName);
    this.getOrderFormComponents().push(
      new FormGroup<OrderRecordFormGroup>({
        name: new FormControl(
          firstAvailableComponentName,
          this.ORDER_FORM_NAME_VALIDATORS
        ),
        count: new FormControl(1, this.ORDER_FORM_COUNT_VALIDATORS),
      })
    );
  }

  removeFormGroupComponent(index: number): void {
    this.getOrderFormComponents().removeAt(index);
  }

  getOrderFormComponents(): FormArray<FormGroup<OrderRecordFormGroup>> {
    return this.orderFormGroup.controls['components'] as FormArray<
      FormGroup<OrderRecordFormGroup>
    >;
  }

  handleSelectValueChange(
    eventTarget: EventTarget | null,
    selectElement: HTMLSelectElement
  ): void {
    if (!eventTarget || !(eventTarget as any)?.value) {
      console.error('Select value hasnt been propagated');
      return;
    }

    selectElement.selectedIndex = 0;
  }

  getInvalidOrderErrorMessage(): string {
    const accumulator: Array<Record<string, any>> = [];
    this.getErrorsFromObject(
      this.orderFormGroup,
      'errors',
      'controls',
      accumulator
    );
    return accumulator.reduce(
      (acc, value) =>
        (acc += Object.keys(value)
          .map(
            v =>
              (formErrorMessages[v as keyof typeof formErrorMessages] ?? v) +
              ' '
          )
          .join(', ')),
      'Violation rules: '
    );
  }

  private getErrorsFromObject<T extends Record<string, any>>(
    object: T,
    key: string = 'errors',
    searchPhrase = 'controls',
    accumulator: Array<T> = []
  ): void {
    if (typeof object === 'object' && key in object && object[key]) {
      accumulator.push(object[key]);
    }

    if (!(searchPhrase in object)) {
      return;
    }

    Object.values(object[searchPhrase])?.map((obj: any) =>
      this.getErrorsFromObject(obj, key, searchPhrase, accumulator)
    );
  }

  private observeFormArrayValueChanged(): void {
    this.orderFormGroup.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.updateAvailableOrderFields();
      });
  }

  private observeFormArrayStatusChanged(): void {
    this.orderFormGroup.statusChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(status => {
        if (status === 'INVALID') {
          console.log(this.getOrderFormComponents());
        }
        console.log(status);
      });
  }

  private updateAvailableOrderFields(): void {
    const pickedOrderFieldsArr = (
      this.orderFormGroup.controls['components'] as FormArray<
        FormGroup<OrderRecordFormGroup>
      >
    ).controls.map(control => control.value?.name);

    this.availableOrderFields = new Set(
      Array.from(this.allOrderFields).filter(
        field => !pickedOrderFieldsArr.includes(field)
      )
    );

    this.canSubtractOrderField =
      this.availableOrderFields.size > 0 &&
      this.getOrderFormComponents().controls.length > 1;
  }
}
