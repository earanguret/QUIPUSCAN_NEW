import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSoloLetras]'
})
export class SoloLetrasDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    // Reemplaza cualquier carácter que no sea una letra
    const valor = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.ngControl.control?.setValue(valor); 
  }
}
