import { FormGroup, AbstractControl } from '@angular/forms';
export interface Error {
    
}
  
export abstract class ErrorData {

    abstract renderServerErrors(formGroup: FormGroup, response:any)
    abstract hasWrongValue(form: FormGroup, fieldName: string)
    abstract hasCorrectValue(form: FormGroup, fieldName: string)
    abstract getFieldError(form: FormGroup, fieldName: string)
    abstract getFieldErrors(control: AbstractControl)
}
  