import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

//validador personalizadao para comparar las contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { 'passwordsNotMatch': true };
  };