import { Directive, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { NzFormControlComponent } from 'ng-zorro-antd/form';

@Directive({
  selector: '[appMensajesControlFormulario]',
  standalone: true
})
export class MensajesControlFormularioDirective {
  constructor(private readonly nzFormControl: NzFormControlComponent) {}

  @Input('appMensajesControlFormulario') set erroresControl(errores: ValidationErrors | null) {
    let errorActual = '';
    if (errores) {
      errorActual = this.nzFormControl.nzErrorTip?.toString() ?? '';
      switch (Object.keys(errores)[0]) {
        case 'required':
          this.nzFormControl.nzErrorTip = 'Este campo es obligatorio';
          break;
        case 'min':
          this.nzFormControl.nzErrorTip = `El valor no puede ser menor a ${errores['min'].min}`;
          break;
        case 'maxlength':
          this.nzFormControl.nzErrorTip = `Solo se pueden ingresar máximo ${errores['maxlength'].requiredLength} caracteres`;
          break;
        case 'minlength':
          this.nzFormControl.nzErrorTip = `Debe ingresar mínimo ${errores['minlength'].requiredLength} caracteres`;
          break;
        case 'email':
          this.nzFormControl.nzErrorTip = 'El correo electrónico ingresado no es válido';
          break;
        case 'patronEmail':
          this.nzFormControl.nzErrorTip = 'El correo electrónico ingresado no es válido';
          break;
        case 'numeroTelefonoConEspacio':
          this.nzFormControl.nzErrorTip = 'El campo debe contener solo números';
          break;
      }

      if (this.nzFormControl.defaultValidateControl && errorActual !== this.nzFormControl.nzErrorTip) {
        this.nzFormControl.defaultValidateControl.control.updateValueAndValidity({ onlySelf: true });
      }
    }
  }
}
