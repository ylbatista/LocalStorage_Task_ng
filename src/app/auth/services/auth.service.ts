import { Injectable, inject } from '@angular/core';
import { LoginResponse, User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly storageKey = 'users';
  private readonly storageKeyUserLogged = 'userLogged';

  public isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedIn.asObservable();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
  ) {}

  // Guardar el arreglo users en localStorage
  saveUsers(users: User[]): void {
    const usersJson = JSON.stringify(users);
    localStorage.setItem(this.storageKey, usersJson);
  }

  // Obtener el arreglo users desde localStorage
  getUsers(): User[] {
    const usersJson = localStorage.getItem(this.storageKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  //obtengo solo los nombre de todos los users creados
  getUsersNames()  {
    const usersEmails = this.getUsers().map(user => user.email);
    return usersEmails;
  }

  // Agregar un nuevo usuario al arreglo y guardarlo en localStorage
  addUser(user: User ): void {
    const users = this.getUsers();

    const existingEmail = users.find(e => e.email === user.email);
    const existingNameUser = users.find(n => n.name === user.name);
   
    if(existingEmail?.email === user.email && existingNameUser?.name === user.name){

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: `Ya existe un usuario registrado con el mismo Email: ${existingEmail?.email}`,
        timer: 5500
      });
      return;

    } else {
      users.push(user);
      this.saveUsers(users);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Correcto',
        text: `Se ha creado el usuario " ${user.name} "`,
        timer: 5500
      });
    }
  }
  
  //guardo usuario logado
  saveUserLogged(userLogged: LoginResponse): void {
    const usersLoggedJson = JSON.stringify(userLogged);
    localStorage.setItem(this.storageKeyUserLogged, usersLoggedJson);
  }

  //obtengo usuario logado
  getUserLogged(): any[] {
    const usersLoggedJson = localStorage.getItem(this.storageKeyUserLogged);
    return usersLoggedJson ? JSON.parse(usersLoggedJson) : [];
  }

  // Obtener solo el email del usuario logado
  getUserLoggedEmail(): string | null {
    const userLogged = this.getUserLogged();
    
    // Verificar si usersLogged es un arreglo y tiene al menos un usuario
    if (userLogged && userLogged.length > 0) {
      // Devuelve el email del primer usuario
      return userLogged[0].email;
    } else {
      return null;
    }
  }

  //verifico si hay un usuario logado
  isLogged(): boolean {
    const userLogged = localStorage.getItem(this.storageKeyUserLogged);

    if(userLogged) {
      try {
        const user: LoginResponse = JSON.parse(userLogged);
        //varifico si token y user existe
        if(user.token && user) {
          return true;
        }
      } catch (error) {

      }
    }
    return false;
  }

  logout(): void {
    // Eliminar el usuario del LocalStorage
    localStorage.removeItem(this.storageKeyUserLogged);
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
