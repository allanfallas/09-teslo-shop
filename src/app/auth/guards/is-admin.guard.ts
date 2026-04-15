import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminAuthenticatedGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {

    const authService = inject(AuthService);
    const isAuthenticated = await firstValueFrom(authService.checkStatus());

    if(isAuthenticated && authService.user()?.roles.includes('admin')){
        return true;
    }

    return false;
}