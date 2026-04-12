import { Component, ElementRef, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'shared-gallery-modal',
  imports: [],
  templateUrl: './gallery-modal.component.html',
})
export class GalleryModalComponent {
  images = input.required<string[]>();
  currentIndex = signal<number>(0);
  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('galleryDialog');

  open(index: number = 0) {
    this.currentIndex.set(index);
    this.dialogRef().nativeElement.showModal();
  }

  close() {
    this.dialogRef().nativeElement.close();
  }

  next(event: Event) {
    event.stopPropagation();
    this.currentIndex.update(i => (i + 1) % this.images().length);
  }

  prev(event: Event) {
    event.stopPropagation();
    this.currentIndex.update(i => (i === 0 ? this.images().length - 1 : i - 1));
  }
}
