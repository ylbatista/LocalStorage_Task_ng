import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';

import { passwordMatchValidator } from './custom-validators';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent implements OnInit {

  hide = true;
  public registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    // Aquí puedes obtener los usuarios y hacer algo si es necesario
    const users = this.authService.getUsers();

    this.registerForm = this.fb.group({
      name:     ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email:    ['', Validators.required],
    }, {
      validators: passwordMatchValidator //Aplico validador personalizado
    });
  }

  addUser(): void {
    
    const newUser: User = this.registerForm.value;

    if(this.registerForm.valid) {
      this.authService.addUser( newUser );
      
      this.registerForm.reset();
    } else {
      Swal.fire('Error', 'Contraseñas de registro no coinciden ó campos del formulario vacíos', 'info');
    }
    
  }

}
