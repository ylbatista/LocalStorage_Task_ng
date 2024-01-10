import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { LoginResponse } from '../../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly storageKey = 'tasks';
  private readonly filteredTasksKey = 'filteredTasks';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }
  
  //guardo array tasks en localstorage
  saveTask( task: Task[] ): void {
    const tasksJson = JSON.stringify(task);
    localStorage.setItem(this.storageKey, tasksJson);
  }

  //obtengo array tasks
  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.storageKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  //guardo array filteredTasks en localstorage
  saveFilteredTask( task: Task[] ): void {
    const tasksJson = JSON.stringify(task);
    localStorage.setItem(this.filteredTasksKey, tasksJson);
  }

  //obtengo array filteredTasks
  getFilteredTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.filteredTasksKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  // Agregar una nueva tarea
  addTask(task: any): void {
    const tasks = this.getTasks();
    console.log('tareas ya guardadas', tasks);
    
    // Asegurarse de que la tarea no existe por su ID
    const existingTask = tasks.find(t => t.id === task.id);
    console.log(' valor si existe la tarea ', existingTask);
    
    if (existingTask === undefined) {
      // Ahora, asegúrate de que no haya otra tarea con el mismo nombre
      const existingTaskByName = tasks.find(t => t.taskName === task.taskName);
      
      if (existingTaskByName) {
        // window.alert(`La tarea ya existe por su nombre `);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: 'Ya existe una tarea con el mismo nombre.',
          timer: 5500
        });
        this.router.navigateByUrl('/task-list')
        return;
      };

      // Si llego aquí, agregamos la tarea
      tasks.push(task);
      this.saveTask(tasks);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Correcto',
        text: `Se ha creado la tarea " ${task.taskName} "`,
        timer: 5500
      });

      this.router.navigateByUrl('/task-list');

    } else {
      console.error('La tarea ya existe por su ID');
    }
  }

  // Obtener una tarea por su ID
  getTaskById(id: string): Task | null {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  // Obtenerel email del usuario logado
  getEmailLogged() {
    const userEmail: LoginResponse[] = this.authService.getUserLogged();
    console.log(userEmail);

    if(userEmail && !Array.isArray(userEmail)) {
      const { email } = userEmail;
      console.log('Email del user',email); 
    }
  }

  // Actualizar una tarea
  updateTask(updatedTask: Task): void {
    if(!updatedTask.id) throw Error('Id de la tarea debe ser requerido');
    if(!updatedTask.taskName) throw Error('Nombre de la tarea debe ser requerida');

    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id );
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTask(tasks);
    } else {
      console.error('No se encontró la tarea para actualizar');
    }
  }

  //Actualizar tarea por id
  updateTaskById(id: string, updatedValues: Partial<Task>): void {
    if (!id) throw Error('ID de la tarea debe ser proporcionado');
  
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === id);
  
    if (index !== -1) {
      const updatedTask = { ...tasks[index], ...updatedValues };
      tasks[index] = updatedTask;
      this.saveTask(tasks);
    } else {
      console.error('No se encontró la tarea para actualizar');
    }
  }

  // Eliminar una tarea
  deleteTask(id: string): void {
    const tasks = this.getTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    this.saveTask(updatedTasks);
  }

  // Eliminar una tarea
  deleteTaskByEmail(email: string): void {
    const tasks = this.getTasks();
    const updatedTasks = tasks.filter(task => task.createdBy !== email);
    this.saveTask(updatedTasks);
  }

  // Obtengo tareas filtradas por usuario logueado
  filteredTasks(): Task[] {
    const userLogged = this.authService.getUserLogged();
    if (userLogged && !Array.isArray(userLogged)) {
      const { email } = userLogged;
      if (email) {
        const allTasks = this.getTasks();
        return allTasks.filter(task => task.createdBy === email);
      } else {
        console.error('Email del usuario no encontrado');
        return [];
      }
    } else {
      console.error('Usuario logado no válido o es un array');
      return [];
    }
  }
}