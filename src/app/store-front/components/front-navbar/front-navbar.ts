import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar { 

  authService = inject(AuthService);

  
  checkStatusResource = rxResource({
    stream: () => this.authService.checkStatus()
  })


}
