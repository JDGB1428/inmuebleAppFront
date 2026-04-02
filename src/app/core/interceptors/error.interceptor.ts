import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toasService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {


      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('user')
        router.navigate(['/auth/login']);
        toasService.show('Su sesion ha expirado, Ingrese nuevamente','error', 3000)
      }

      if (error.status === 403) {
        toasService.show('Este usuario no tiene los persmisos para entrar a esta seccion','error', 3000)
      }

      return throwError(() => error);
    })
  );
};
