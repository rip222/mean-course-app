import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthStatusListener().subscribe(data => this.isLoading = data);
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.authService.login(form.value.email, form.value.password);
    }
  }

}
