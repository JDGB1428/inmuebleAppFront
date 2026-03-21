import { Component, ElementRef, input, output, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  title = input<string>('');
  message = input<string>('');
  confirmText = input<string>('');
  cancelText = input<string>('');
  confirm = output<void>();

  @ViewChild('dialogModal') dialog!: ElementRef<HTMLDialogElement>

  open() {
    this.dialog.nativeElement.showModal();
  }

  close() {
    this.dialog.nativeElement.close();
  }


  onConfirmClick() {
    this.confirm.emit();
    this.close();
  }
}
