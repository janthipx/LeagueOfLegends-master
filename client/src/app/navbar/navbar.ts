import { Component, computed, inject, Signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PassportService } from '../_services/passport-service/passport-service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
})
export class Navbar {
  private _passport =inject(PassportService)
  display_name: Signal<string | undefined>
  avatar_url: Signal<string | undefined>
  private _router = inject(Router);

  constructor() {
    this.display_name = computed(() => this._passport.data()?.display_name);
    this.avatar_url = computed(() => getAvatarUrl(this._passport.data()?.avatar_url));

  }

  logout(){
    this._passport.destroy()

    this._router.navigate(['/login'])
  }
}




function getAvatarUrl(avatar_url: string | undefined): string {
  return avatar_url || 'assets/default_avatar.jng'; 
}
