import { Injectable } from '@angular/core';
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';



// import { NotificationService } from './notification.service';

@Injectable()
export class ErrorService {

  constructor(
    // private translateService: TranslateService,
    // private notificationService: NotificationService
    ) { }

  renderServerErrors(form: FormGroup, response: any) {
    if (response.error.errors == null) {
      // server error responses are consistent, if the errors array is not defined
      // it is very likely that there are issues with the server.

      // this.translateService.get('message.serverUnavailable')
      //   .subscribe(msg => this.notificationService.error(msg));

      return;
    }
    console.log('errorsChildren',response.error.errors.children);
    Object.keys(response.error.errors.children).forEach(prop => {

      const formControl = form.get(prop);
      if (formControl !== null ) {
        console.log('prop', formControl);
        if ( formControl['controls'] ) {
          console.log('entro');
          Object.keys(response.error.errors.children[prop].children).forEach(childProp => {

            const childFormControl = form.get(prop)['controls'][childProp];

            console.log('childProp', childFormControl);

            if (childFormControl !== null ) {
              if ( childFormControl['controls'] ) {
                  console.log('subform');
              } else {
                  childFormControl.setErrors({
                  serverError: response.error.errors.children[prop].children[childProp].errors
                });
              }
            }
          });
        } else {
          formControl.setErrors({'required': true});
        }
      }

      // if (formControl) {
      //   // activate the error message
      //   formControl.setErrors({
      //     serverError: response.error.errors.children[prop].errors
      //   });
      // }
    });
    // response.error.errors.children.forEach((element: any) => {
    //   // field errors are handled here, different errors should be handled globally

    //   if (element.type === 'field-validation-error') {
    //     const fieldName = element.field;
    //     const message = element.message;
    //     if (form == null || !this.hasFieldName(form, fieldName)) {
    //       // this.notificationService.error(`${fieldName}: ${message}`);
    //       console.log('asdsadsad', `${fieldName}: ${message}`);
    //     } else {
    //       this.setFieldError(form, fieldName, message);
    //     }
    //   } else {
    //     const fieldName = element.field;
    //     const message = element.message;
    //     console.log('asdsadsad', `${fieldName}: ${message}`);
    //     // this.notificationService.error(message);
    //   }
    // });
  }

  hasWrongValue(form: FormGroup, fieldName: string): boolean {
    return this.getFieldErrors(form, fieldName).length > 0;
  }

  // a field is correct only if it is filled and have no errors
  hasCorrectValue(form: FormGroup, fieldName: string): boolean {
    const control = this.findFieldControl(form, fieldName);
    // field found && user changed it && it doesn't hold a wrong value
    const isCorrect = control && !control.pristine && !this.hasWrongValue(form, fieldName);

    return isCorrect;
  }

  // right now we are rendering one error only for a field
  getFieldError(form: FormGroup, fieldName: string): string {
    return this.getFieldErrors(form, fieldName)[0];
  }

  getFieldErrors(form: FormGroup, fieldName: string): string[] {
    const control = this.findFieldControl(form, fieldName);
    if (control && control.touched && control.errors) {
      return this.getErrors(control);
    } else {
      return [];
    }
  }

  getErrors(control: AbstractControl): string[] {
    return Object.keys(control.errors)
      .filter((error: any) => control.errors[error])
      .map((error: any) => {
        const params = control.errors[error];
        return error;
      });
  }

  private hasFieldName(form: FormGroup, fieldName: string): boolean {
    const control = this.findFieldControl(form, fieldName);
    return control != null;
  }

  private setFieldError(form: FormGroup, fieldName: string, message: string) {
    const control = this.findFieldControl(form, fieldName);
    // TODO: find a better way to set the error message
    const errors = { [message]: true };
    control.setErrors(errors);
  }

  private findFieldControl(form: FormGroup, fieldName: string): AbstractControl {
    return form.get(fieldName);
  }
}
