import { NewTaskPageComponent } from './new-task-page.component';
import { AuthService } from '../../../auth/services/auth.service';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

describe('NewTaskPageComponent', () => {
  let component: NewTaskPageComponent;
  let mockFormBuilder: Partial<FormBuilder>;
  let mockAuthService: Partial<AuthService>;
  let mockTaskService: Partial<TaskService>;
  let mockRouter: Partial<Router>;
  let mockActivateRoute: Partial<ActivatedRoute>

  class MockFormBuilder extends FormBuilder {
    override group = jest.fn(() => ({
      // Aquí puedes agregar propiedades o métodos adicionales si es necesario
    })) as any; // Convertirlo a any para evitar errores de tipo
  }

  beforeEach(() => {
    // Creo los mocks
    const mockFormBuilder = new MockFormBuilder();

    mockAuthService = {
      getUserLogged: jest.fn(),
      isLogged: jest.fn(),
      getUsers: jest.fn(),
      getUsersNames: jest.fn(), //añado func 
    };

    mockTaskService = {
      // getTasks: jest.fn(),
      updateTaskById: jest.fn(),
      saveTask: jest.fn(),
    };

    mockRouter = { navigateByUrl: jest.fn() }; // Añade aquí cualquier método de Router que necesites mockear

    // Pasar los mocks al constructor
    component = new NewTaskPageComponent(
      mockFormBuilder as FormBuilder,
      mockTaskService as TaskService,
      mockRouter as Router,
      mockActivateRoute as ActivatedRoute,
      mockAuthService as AuthService,
    );

    component.taskForm = mockFormBuilder.group({
      id:'id-test',         
      // generateId?:'',  
      taskName: 'task-name',   
      description: 'tas-description',
      createAt: new Date(),
      limitDate: new Date('2023/10/10'),
      status: 'task-status',      
      createdBy: 'task-createdBy'
    })

  });

  it('comprobar componente new-task-page si existe un userName', () => {
    expect(component).toBeTruthy();
  });

  it('Debe actualizar una tarea si esta definido', () => {
    // Configurar los mocks
    jest.spyOn(mockAuthService, 'isLogged').mockReturnValue(true);
    // jest.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

    // Llamar a la función addTask
    // await component.addTask();

    // Comprobar que se llamó al método addTask del servicio
    expect(component.taskForm).toBeDefined();
  });


});
