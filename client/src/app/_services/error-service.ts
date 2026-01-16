import { inject, Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { throwError } from "rxjs";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})

export class ErrorService {
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private _snackBarConfig: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
  }

  handleError(error: any) {
    if (error) {
      switch (error.status) {
        case 400:
          if(error.error.message)
            this._snackBar.open(error.error.message, 'Ok', this._snackBarConfig);
          if(error.message)
            this._snackBar.open(error.message, 'Ok', this._snackBarConfig);
          if(error.error)
            this._snackBar.open(error.error.message, 'Ok', this._snackBarConfig);
        break;
        case 401:
          this._snackBar.open('unauthorized', 'ok', this._snackBarConfig);
          break;
        case 404:
          this._router.navigate(['/not-found']);
          break;
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
        case 506:
        case 507:
        case 508:
        case 509:
        case 510:
        case 511:
          const navExtras: NavigationExtras = {
            state: { error: error.error }
          }
          this._router.navigate(['server-error'], navExtras);
          break;
        default:
          this._snackBar.open('some thing went wrong!! please try again later', 'ok', this._snackBarConfig);
          break;
      }
    }
    return throwError(() => error);
  }
}