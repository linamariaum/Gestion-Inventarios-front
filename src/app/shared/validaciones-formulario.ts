import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class ValidacionesFormulario extends Validators {

  static patronEmail(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const regexEmail = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

      return regexEmail.test(control.value) ? null : { email: true };
    } else {
      return null;
    }
  }

  static numeroTelefonoConEspacio(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const regexTelefono = new RegExp(/^[\d\s]+$/);

      return regexTelefono.test(control.value) ? null : { numeroTelefonoConEspacio: true };
    } else {
      return null;
    }
  }

}
