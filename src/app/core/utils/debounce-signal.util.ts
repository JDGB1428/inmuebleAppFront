import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export function debounceSignal<T>(source: Signal<T>, timeMs = 400): Signal<T> {
  return toSignal(
    toObservable(source).pipe(
      debounceTime(timeMs),
      distinctUntilChanged()
    ),
    { initialValue: source() }
  );
}
