import { AbstractControl, ValidatorFn,  ValidationErrors, FormGroup} from "@angular/forms"
import { form } from "@angular/forms/signals";


export const PasswordValidator = (min: number, max: number): ValidatorFn => {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const password = ctrl.value as string;
    if (!password) {return { required: true };}
    if (password.length < min || password.length > max) {return { invalidLength: true };}
    if (!/[A-Z]/.test(password)) {return { invalidLowerCase: true };}
    if (!/[a-z]/.test(password)) {return { invalidUpperCase: true };}
    if (!/[0-9]/.test(password)) {return { invalidNumeric: true };}
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {return { invalidSpecialCharacter: true };}
    return null;
  }

}

export const PassportMatchValidator = (controlName: string, matchingControlName: string): ValidatorFn => {
  return (FormGroup: AbstractControl)=> {
    const ctrlPw = FormGroup.get(controlName) ;
    const ctrlCfPw = FormGroup.get(matchingControlName) ;
    if (!ctrlPw || !ctrlCfPw) {return null;}
    const isMatch = ctrlPw.value === ctrlCfPw.value;
    if (!isMatch) {ctrlCfPw.setErrors({ missMatch: true });}
    else {ctrlCfPw.setErrors(null);}
    return null;
  }
}