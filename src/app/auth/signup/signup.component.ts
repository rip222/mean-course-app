import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {
  isAuth: Observable<boolean>;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatusListener();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      const email = form.value.email;
      const pass = form.value.password;
      this.authService.createUser(email, pass);
    }
  }

}
