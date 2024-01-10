import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginResponse } from '../../../auth/interfaces/user.interface';
import { MaterialModule } from '../../../material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-list-task-page',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatFormFieldModule, MatSelectModule,
    FormsModule, ReactiveFormsModule, MaterialModule, ],
  
  templateUrl: './list-task-page.component.html',
  styleUrl: './list-task-page.component.scss'
})

export class ListTaskPageComponent {
  hidden = false;
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  public taskStatus: string[] = ['Todos','creado','progreso','finalizado','incompleto'];
  public userTasks: Task[] = [];
  public filteredTasks: Task[] = [];
  
  public selectedStatus: string = this.taskStatus[0];
  public selectedTaskName: string = this.taskStatus[0];
  
  displayedColumns: string[] = ['taskName', 'description', 'createAt', 'limitDate', 'status', 'actions'];
  dataSource!: MatTableDataSource<Task>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public userLogged: LoginResponse[] = [];
  public name_UserNameLogged: string = '';
  public email_UserNameLogged: string = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  //muestro usuario logado
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

  //refrescar el DataSource
  refreshDataSource(): void {
    // Obtengo tareas del user actualizadas desde el servicio
    this.filteredTasks = this.taskService.filteredTasks();

    this.dataSource = new MatTableDataSource<Task>(this.filteredTasks);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.userTasks = this.taskService.getFilteredTasks();

    this.getUserLoggedName();
    
    //filtrando tasks por email logado y asignarselo al dataSource
    const userEmailLogged = this.email_UserNameLogged;

    //valido q se halla obtenido email valido
    if(userEmailLogged) {
      //obtengo tasks
      this.userTasks = this.taskService.getTasks();
      //filtro por email del usuario logado
      const filteredTasks = this.userTasks.filter(task => task.createdBy === userEmailLogged);
      //asigno tareas filtradas al datasSource
      this.filteredTasks = filteredTasks;
      this.dataSource = new MatTableDataSource<Task>(filteredTasks);
    } else {
      // console.error('no se pudo obtener email de user logado')
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  //filtrar por busqueda
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //filtrar por nombre de tarea
  applyTaskNameFilter(): void {
    this.selectedStatus = '';

    const searchTerm = this.selectedTaskName.toLowerCase();

    if(searchTerm && this.filteredTasks.length > 0) {
      const filteredTask = this.filteredTasks.filter(task => task.taskName.toLowerCase() === searchTerm );
      this.dataSource.data = filteredTask
    }
  }

  //filtrar por estados
  applyFilters(): void {
    //asigno a selectedTaskName un valor vacío para limpiar el campo
    this.selectedTaskName = '';

    const filteredTasks = ['Todos los nombres', ...this.filteredTasks];

    if (this.selectedStatus === 'Todos') {
      this.dataSource.data = [...this.filteredTasks];
    } else {
      this.dataSource.data = this.filteredTasks.filter(task => task.status === this.selectedStatus)
    };
  }

  updateStatus(id: string ) {
    this.refreshDataSource();
    const task = this.taskService.getTaskById(id);
  
    if (!task) {
      // console.error('Tarea no encontrada');
      return;
    }
  
    let allowedStatuses: string[];
  
    // Aquí, se muestra un SweetAlert con los estados permitidos.
    Swal.fire({
      title: 'Seleccione un nuevo estado',
      text: `Estado actual de la tarea: ${task.status}`,
      input: 'select',
      inputOptions: {
        'progreso': 'Progreso',
        'finalizado': 'Terminado',
        'incompleto': 'No Completado'
      },

      inputPlaceholder: 'Selecciona un estado',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
      
    }).then((result) => {

      if (result.isConfirmed) {

        const newStatus = result.value;
        
        if (allowedStatuses.includes(newStatus)) {
          
          // Actualizo el estado de la tarea
          this.taskService.updateTaskById(id,{status: newStatus});
          
          setTimeout(() => {
            
            // Recargar la lista de tareas
            this.refreshDataSource();
          }, 500);

          Swal.fire('¡Hecho!', `Estado de la tarea actualizado a ${newStatus}`, 'success');

        } else {
          Swal.fire('Error', 'Estado no permitido para la tarea, el estado seleccionado esta activo.', 'error');
        }
      }

    });

    switch (task.status) {
      case 'finalizado':
      case 'incompleto':
        Swal.fire({
          title: 'Error',
          text: 'No se puede realizar ningún cambio sobre la tarea con estado terminado o no completado.',
          icon: 'error'
        });
        return;
  
      case 'progreso':
        allowedStatuses = ['finalizado', 'incompleto'];
        break;
  
      case 'creado':
        allowedStatuses = ['progreso', 'finalizado', 'incompleto'];
        break;
  
      default:
        // console.error('Estado de tarea no reconocido');
        return;
    } 
  }

  deleteTask(task: Task): void {
    if(!this.authService.isLogged()) {
      this.router.navigateByUrl('/login');
      
    } else {

      Swal.fire({

        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la tarea "${task.taskName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'

      }).then((result) => {

        if (result.isConfirmed) {
          // Llamar al método deleteTask del servicio
          this.taskService.deleteTask(task.id);
          // Recargar la lista de tareas
          this.refreshDataSource();

          Swal.fire('Eliminado', `La tarea "${task.taskName}" ha sido eliminada`, 'success');
        }
      });
    }
  }
  // tarea en progreso mas antigua
  findOldestInProgressTask(): Task | null {
    let oldestTask: Task | null = null;
    let oldestDate: Date | null = null;
  
    for (const task of this.filteredTasks) {
      if (task.status === 'progreso') {
        const currentDate = new Date(task.createAt);
        if (!oldestDate || currentDate < oldestDate) {
          oldestDate = currentDate;
          oldestTask = task;
        }
      }
    }
    return oldestTask;
  }

  showOldestInProgressTask(): void {
    const oldestTask = this.findOldestInProgressTask();
    
    if (oldestTask) {
      Swal.fire({
        title: 'Tarea más antigua en progreso',
        html: `
          <strong>Nombre Tarea:</strong> ${oldestTask.taskName }<br>
          <strong>Descripción:</strong> ${oldestTask.description}<br>
          <strong>Creada el:</strong> ${new Date(oldestTask.createAt).toLocaleDateString()}<br>
          <!-- Agrega más detalles si es necesario -->
        `,
        confirmButtonText: 'Cerrar'
      });
        
    } else {
      Swal.fire('¡No hay tareas en progreso!', 'No hay tareas en estado "En Progreso".', 'info');
    }
    
  }

  //Tareas que vencieron la fecha límite de realización
  findExpiredTasks(): Task[] {
    const currentDate = new Date();
    return this.filteredTasks.filter(task => new Date(task.limitDate) < currentDate);
  }

  showExpiredTasks(): void {
    const expiredTasks = this.findExpiredTasks();
    
    if (expiredTasks.length > 0) {
      let tasksList = '<ul>';
      
      expiredTasks.forEach(task => {
        tasksList += `<li> Nombre tarea: ${task.taskName} - Fecha límite: ${new Date(task.limitDate).toLocaleDateString()}</li>`;
      });
  
      tasksList += '</ul>';
  
      Swal.fire({
        title: 'Tareas que vencieron la fecha límite de realización',
        html: tasksList,
        confirmButtonText: 'Cerrar'
      });
    } else {
      Swal.fire('¡Sin tareas vencidas!', 'No hay tareas que hayan superado su fecha límite.', 'info');
    }
  }
  
}