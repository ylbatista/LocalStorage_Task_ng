import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { TaskService } from '../../tasks/services/task.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(
        private authService: AuthService,
        private taskService: TaskService, 
    ) { }

  deleteAllTasksWithEmail() {
    // Obtener el email del usuario logado
    const userLogged = this.authService.getUserLogged();
    let timerInterval = 2000;

    if (userLogged && !Array.isArray(userLogged)) {
        const { email } = userLogged;
        // console.log('Email del user logado', email);

        // Mostrar Swal de eliminación
        Swal.fire({
            title: "Proceso no reversible...",
            html: "Eliminando usuario y tareas correspondientes. el proceso termina en <b></b> milliseconds.",
            timer: 2000,
            timerProgressBar: true,
            // allowOutsideClick: false, // Evitar que el usuario cierre el Swal haciendo clic fuera
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup()?.querySelector("b");
                if(timer) {
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                }
            },

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {

            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });

        setTimeout(() => {
            // Obtener todas las tareas
            const allTasks = this.taskService.getTasks();

            if (allTasks) {
                // Filtrar las tareas que coinciden con el usuario logado
                const tasksToDelete = allTasks.filter(task => task.createdBy === email);

                // Eliminar las tareas filtradas del servicio de tareas
                for (const task of tasksToDelete) {
                    this.taskService.deleteTask(task.id); 
                }

                // Eliminar el usuario cuyo email coincida con el email del usuario logado
                const allUsers = this.authService.getUsers();
                const updatedUsers = allUsers.filter(user => user.email !== email);
                this.authService.saveUsers(updatedUsers); 

                // Cerrar Swal después de eliminar tareas y usuario
                Swal.close();

                // Llamar a la función logout
                this.authService.logout();
            } else {
                console.error('No se pudieron obtener las tareas del usuario logado');
                Swal.fire("Error", "Hubo un problema al obtener las tareas del usuario.", "error");
            }
        }, 2000);
    } else {
        console.error('Usuario logado no válido o es un array');
        Swal.fire("Error", "Usuario logado no válido o es un array.", "error");
    }
}


  

}
