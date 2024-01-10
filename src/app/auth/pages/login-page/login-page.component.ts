import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { LoginResponse, User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ CommonModule, RouterModule, MaterialModule, FormsModule,ReactiveFormsModule ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})

export class LoginPageComponent implements OnInit {
  
  hide = true;

  // public isLoggedSignal = signal(false);

  public loginForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ 'yuri@yuri.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(5)]]
    })
  }

  onLogin(): void {
    const users = this.authService.getUsers();
  
    if (users.length === 0) {
      
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error...',
        text: 'Por favor regístrese',
        timer: 3000,
      });
  
    } else {
      
      //login
      const { email, password } = this.loginForm.value;
  
      // Buscar usuario por su email
      const user: User | undefined = users.find((user: User) => user.email === email);
  
      if (user) {

        if (user.email === email && user.password === password) {
          const loggedInUser: LoginResponse = {
            name: user.name,
            email: user.email,
            password: user.password,
            token: `Bearer:${user.name}.${user.password}.${user.email}`,
          };
  
          this.authService.saveUserLogged(loggedInUser);

          this.authService.isLoggedIn.next(true);

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Logado Correctamente',
            showConfirmButton: false,
            timer: 1500,
          });
  
          this.router.navigateByUrl('/task-list');

        } else {

          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error...',
            text: 'Credenciales Incorrectas',
            timer: 3000,
          });
        }

      } else {

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error...',
          text: 'Usuario no encontrado',
          timer: 3000,
        });
      }
    }
  }
  

  createToken(claims: any, expiresIn: number){

  }

 

}
