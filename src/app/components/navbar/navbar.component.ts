import { Component, Input, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../tasks/services/task.service';
import { UserService } from '../../auth/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule, RouterLink, MaterialModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  public userLogged = this.authService.getUserLogged();

  public isLoggedIn = false;
  
  public name_UserNameLogged: string = '';
  public email_UserNameLogged: string = '';

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private userService: UserService
  ){
    this.getUserLoggedName();
  }

  ngOnInit(){
    //escucho cambios en el estado de autenticacion para 
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }

  getUserLoggedName(){
    this.userLogged = this.authService.getUserLogged();

    if(this.userLogged && !Array.isArray (this.userLogged)) {
      const { name, email } = this.userLogged;
      this.name_UserNameLogged = name;
      this.email_UserNameLogged = email;
    } else {
      // console.error('Usuario logado no valido')
    }
  }

  onLogout(){
    this.authService.logout();
  }

  onDeleteUserLogged(){

    this.userService.deleteAllTasksWithEmail();
   
  }

}
