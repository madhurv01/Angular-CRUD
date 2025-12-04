import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  submitted = false;

  constructor(private router: Router) {}

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.invalid) {
      return; // show error messages
    }

    this.router.navigate(['/home']);
  }
}
