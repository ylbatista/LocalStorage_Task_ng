import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import Swal from 'sweetalert2';

import {v4 as uuid} from 'uuid';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-new-task-page',
  standalone: true,
  imports: [ CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-task-page.component.html',
  styleUrl: './new-task-page.component.scss'
})

export class NewTaskPageComponent implements OnInit {
  
  hide = true;

  public taskForm!: FormGroup;
  public task: Task | null = null;

  public email_UserNameLogged: string ='';

  users: string[] = ['One', 'Two', 'Three'];
  userLogged: User[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private authService: AuthService
  ){
    this.users = this.authService.getUsersNames();

    this.userLogged = this.authService.getUserLogged();
    
    this.getUserLoggedName();
  }
  
  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  getUserLoggedName(){
    this.userLogged = this.authService.getUserLogged();

    if(this.userLogged && !Array.isArray (this.userLogged)) {
      const { name, email } = this.userLogged;
      this.email_UserNameLogged = email;
    } else {
      // console.error('Usuario logado no valido')
    }
  }

  initializeForm(): void {
    
    const currentDate = new Date().toISOString().substring(0, 10);

    this.taskForm = this.fb.group({
      id: [uuid()],
      taskName: ['', Validators.required],
      createAt: [currentDate, Validators.required],
      limitDate: ['', Validators.required],
      status: [{ value: 'creado', disabled: true }],
      description: ['VALOR POR DEFECTO', Validators.required],
      createdBy: [{value: this.email_UserNameLogged, disabled: true}],
    });
  }

  checkEditMode(): void {

      if (!this.router.url.includes('edit')) return;

      this.activateRoute.params.subscribe(params => {
        
        const taskId = params['id'];
        this.task = this.taskService.getTaskById(taskId);
        if (!this.task) {

        } else {
          this.taskForm.patchValue(this.task);
        }
      });
    // }
  }

  addTask(): void {

    if (this.taskForm.invalid){
      Swal.fire('Formulario con campos vacíos.', '', 'info');
      return
    };
        
    const task: Task = this.taskForm.getRawValue();

    if (this.task) {
      Swal.fire({
        title: '¿Desea actualizar la tarea?',
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.taskService.updateTask(task);
          this.showSuccessMessage('Tarea actualizada correctamente.');

        } else if (result.isDenied) {
          Swal.fire('Actualización cancelada', '', 'info');
        }
      });
    } else {
      this.taskService.addTask(task);
      this.taskForm.reset();

    }

  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigateByUrl('/task-list');
    });
  }
  
}
