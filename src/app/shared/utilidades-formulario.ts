import { AbstractControl, UntypedFormArray, UntypedFormGroup, ValidatorFn } from '@angular/forms';

export class UtilidadesFormulario {

  static marcarErroresControlesFormulario(controls: { [key: string]: AbstractControl } | AbstractControl[]) {
    Object.values(controls).forEach((control) => {
      if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        this.marcarErroresControlesFormulario(control.controls);
      } else {
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    });
  }

  static asignarValidador(control: AbstractControl, validador: ValidatorFn | ValidatorFn[]) {
    control?.setValidators(validador);
    control?.updateValueAndValidity();
  }

  static agregarValidador(control: AbstractControl, validador: ValidatorFn | ValidatorFn[]) {
    control?.addValidators(validador);
    control?.updateValueAndValidity();
  }

  static eliminarValidador(control: AbstractControl, validador: ValidatorFn | ValidatorFn[]) {
    control?.removeValidators(validador);
    control?.updateValueAndValidity();
  }

  static eliminarValidadores(formulario: UntypedFormGroup): void {
    Object.keys(formulario.controls).forEach((nombreControl) => {
      formulario.get(nombreControl)!.clearValidators();
      formulario.get(nombreControl)!.updateValueAndValidity();
    });
  }

}
