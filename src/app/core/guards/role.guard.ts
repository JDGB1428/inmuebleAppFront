import { inject } from "@angular/core";
import {CanMatchFn, Router } from "@angular/router";

export const roleGuard: CanMatchFn = (route) => {
  const router = inject(Router);

  const saveRole = localStorage.getItem('roles') || sessionStorage.getItem('roles')
  const userRoles: string[] = saveRole ? [saveRole] : [];

  const expectedRoles = route.data?.['expectedRoles'] as string [];

  const hasAccess = userRoles.some(role => expectedRoles.includes(role));

  if (hasAccess) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
}
