import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatch: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pass = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    if (!pass || !passwordConfirm) return null;

    return pass.value == passwordConfirm.value ? null : { passwordMatch: true };
  };