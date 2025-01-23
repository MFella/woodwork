import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject, take, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private static readonly DEFAULT_HIDE_IN_MS = 6000;
  private static readonly ERROR_ALERT_CLASS = 'error-alert';
  private readonly bannerDestroyed$: Subject<void> = new Subject<void>();

  private renderer2: Renderer2;
  private readonly document = inject(DOCUMENT);

  constructor(rendererFactory2: RendererFactory2) {
    this.renderer2 = rendererFactory2.createRenderer(null, null);
  }

  showError(
    message: string,
    hideInMs: number = AlertService.DEFAULT_HIDE_IN_MS
  ): void {
    const errorAlertChild = Array.from(this.document.body.childNodes).find(
      node =>
        ((node as any).classList as DOMTokenList)?.contains(
          AlertService.ERROR_ALERT_CLASS
        )
    );
    if (errorAlertChild) {
      this.bannerDestroyed$.next();
      this.renderer2.removeChild(document.body, errorAlertChild);
    }

    const errorMessageHtml = this.getErrorAlertHTMLTemplate(message);

    const errorAlertElement: HTMLDivElement =
      this.renderer2.createElement('div');

    this.setHTMLDivElementStyles(errorAlertElement);
    errorAlertElement.innerHTML = errorMessageHtml;
    this.renderer2.appendChild(document.body, errorAlertElement);

    timer(hideInMs)
      .pipe(take(1), takeUntil(this.bannerDestroyed$))
      .subscribe(() => {
        this.renderer2.removeChild(document.body, errorAlertElement);
      });
  }

  private getErrorAlertHTMLTemplate(errorMessage: string): string {
    return `
<div role="alert" class="alert alert-error">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>${errorMessage}</span>
</div>
    `;
  }

  private setHTMLDivElementStyles(htmlDivElement: HTMLDivElement): void {
    htmlDivElement.style.position = 'fixed';
    htmlDivElement.style.right = '0';
    htmlDivElement.style.bottom = '0';
    htmlDivElement.style.padding = '2rem';
    htmlDivElement.style.borderRadius = '.5rem';
    htmlDivElement.style.boxShadow =
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);';
  }
}
