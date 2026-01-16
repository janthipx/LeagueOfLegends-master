import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlContainer } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PassportMatchValidator, PasswordValidator } from '../_helpers/passwordvalidator/passwordvalidator';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PassportService } from '../_services/passport-service/passport-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,            // ✅ จำเป็นมาก
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})


export class Login {
  private usernameMinLength = 4
  private usernameMaxLength = 10

  private passwordMinLength = 8
  private passwordMaxLength = 10

  private displayNameMinLength = 3


  mode: 'login' | 'register' = 'login'
  form: FormGroup

   errorMsg = {
    username: signal(''),
    password: signal(''),
    cf_password:  signal(''),
    display_name: signal(''),
    server: signal(''),
  } 

  private _router = inject(Router)
  private _passport = inject(PassportService)

  constructor() {
    if (this._passport.data() ) {
      this._router.navigate(['/'])
    }
    this.form = new FormGroup({
      username: new FormControl(null, [
        Validators.required, 
        Validators.minLength(this.usernameMinLength), 
        Validators.maxLength(this.usernameMaxLength)
      ]),
      password: new FormControl(null, [
        Validators.required, 
        PasswordValidator(8, 10)
      ])
    })
  }

 toggleMode() {
  this.mode = this.mode === 'login' ? 'register' : 'login'
  this.updateForm()
  this.form.reset()
}


  updateForm() {
    if (this.mode === 'login') {
      this.form.removeControl('cf_password')
      this.form.removeValidators(PassportMatchValidator('password', 'cf_password'))
      this.form.removeControl('display_name')
    } else {
      this.form.addControl('cf_password', new FormControl(null, [Validators.required]))
      this.form.addValidators(PassportMatchValidator('password', 'cf_password'))

      this.form.addControl('display_name', new FormControl(null, [Validators.required, Validators.minLength(3)]))
    }
  }

  updateErrorMessage(ctrlName: string): void {
    const control = this.form.controls[ctrlName]
    if (!control) return
  
    switch (ctrlName) {
      case 'username':
        if (control.hasError('required')) this.errorMsg.username.set('required')

        else if (control.hasError('minlength'))
          this.errorMsg.username.set('must be at least 4 characters long')

        else if (control.hasError('maxlength'))
          this.errorMsg.username.set('must be 16 characters or fewer')

        else this.errorMsg.username.set('')
       
      break
    case 'password':
      if (control.hasError('required'))
          this.errorMsg.password.set('required')
        else if (control.hasError('invalidMinLength'))
          this.errorMsg.password.set('must be at least 8 characters long')
        else if (control.hasError('invalidMaxLength'))
          this.errorMsg.password.set('must be 16 characters or fewer')
        else if (control.hasError('invalidLowerCase'))
          this.errorMsg.password.set('must contain minimum of 1 lower-case letter [a-z].')
        else if (control.hasError('invalidUpperCase'))
          this.errorMsg.password.set('must contain minimum of 1 capital letter [A-Z].')
        else if (control.hasError('invalidNumeric'))
          this.errorMsg.password.set('must contain minimum of 1 numeric character [0-9].')
        else if (control.hasError('invalidSpecialChar'))
          this.errorMsg.password.set('must contain minimum of 1 special character: !@#$%^&*(),.?":{}|<>')
        else this.errorMsg.password.set('')
      break
    case 'cf_password':
      if (control.hasError('required'))
          this.errorMsg.cf_password.set('required')

        else if (control.hasError('mismatch'))
          this.errorMsg.cf_password.set('do not match password')

        else
          this.errorMsg.cf_password.set('')
      break
    case 'display_name':
      if (control.hasError('required')) {
          this.errorMsg.display_name.set('Display name is required');
        }
        else {
          this.errorMsg.display_name.set(`must be at least ${this.displayNameMinLength} characters long`);
        }
      break
    }
    console.log(this.errorMsg)
  }

    async onSubmit() {
    let errorMsg: null | string = null
    if (this.mode === 'login') {
      errorMsg = (await this._passport.get(this.form.value)) as string | null
    } else {
      errorMsg = (await this._passport.register(this.form.value)) as string | null
    } 
    if (!errorMsg) this._router.navigate(['/'])
    else {
      this.errorMsg.server.set(errorMsg)
    }
  }
}
