import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSoloNumeros]'
})
export class SoloNumerosDirective {

  constructor(private ngControl: NgControl) {}
  
  @HostListener('input', ['$event']) onInputChange(event: any) {
    // Reemplazar cualquier carácter que no sea un dígito
    const valor = event.target.value.replace(/[^0-9]/g, '');
    this.ngControl.control?.setValue(valor); // Actualizar el control con el valor filtrado
  }

}
