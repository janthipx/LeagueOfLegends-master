import { Component, inject } from '@angular/core';
import { PassportService } from '../_services/passport-service/passport-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private _router = inject(Router)
  private _passport = inject(PassportService)

  constructor() {
    if (this._passport.data() ) {
      this._router.navigate(['/login'])
    }
  }
}


