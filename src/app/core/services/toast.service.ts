import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  closing: boolean;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private counter = 0;

  show(text: string, type: ToastType = 'info', duration = 3000) {
    const id = ++this.counter;
    // Guardamos la duración en el objeto
    this._toasts.update(c => [...c, { id, text, type, closing: false, duration }]);

    if (duration > 0) setTimeout(() => this.startRemove(id), duration);
  }

  startRemove(id: number) {
    this._toasts.update(current =>
      current.map(t => t.id === id ? { ...t, closing: true } : t)
    );

    setTimeout(() => {
      this._toasts.update(current => current.filter(t => t.id !== id));
    }, 200);
  }
}
