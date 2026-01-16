import { HttpInterceptorFn } from "@angular/common/http";
import { LoadingService } from "../_services/losding";
import { inject } from "@angular/core";
import { delay } from "rxjs/internal/operators/delay";
import { finalize } from "rxjs/internal/operators/finalize";

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(LoadingService)
  spinner.loading();
  return next(req).pipe(
    delay(2000),
    finalize(() => spinner.idle())
  )
}