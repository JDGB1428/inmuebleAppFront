import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptors: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  let newHeaders = req.headers
    .set('Accept', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest');

  if(token) {
    newHeaders = newHeaders.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({
    headers: newHeaders
  });

  return next(authReq);
}
