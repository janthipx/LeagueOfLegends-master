import { CanActivateFn, Router } from '@angular/router';
import { PassportService } from '../_services/passport-service/passport-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const passport = inject(PassportService)
  const router = inject(Router)

  if (passport.data()) {
    return true;
  } else {
    router.navigate(['/not-found']);
    return false;
  }
}