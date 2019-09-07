import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  isAuth: Observable<boolean>;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatusListener();
  }

  onLogout() {
    this.authService.logout();
  }

}
