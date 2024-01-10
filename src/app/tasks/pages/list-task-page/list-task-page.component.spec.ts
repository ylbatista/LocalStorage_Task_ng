import { AuthService } from '../../../auth/services/auth.service';
import { ListTaskPageComponent } from './list-task-page.component';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

describe('ListTaskPageComponent', () => {
  let component: ListTaskPageComponent;
  let mockAuthService: Partial<AuthService>;
  let mockTaskService: Partial<TaskService>;
  let mockRouter: Partial<Router>;

  class MockFormBuilder extends FormBuilder {
    override group = jest.fn(() => ({
      // Aquí puedes agregar propiedades o métodos adicionales si es necesario
    })) as any; // Convertirlo a any para evitar errores de tipo
  }

  beforeEach(() => {
    // Crear los mocks
    const mockFormBuilder = new MockFormBuilder();

    mockAuthService = {
      getUserLogged: jest.fn(),
      isLogged: jest.fn()
    };
    mockTaskService = {
      getTasks: jest.fn(),
      saveTask: jest.fn(),
      deleteTask: jest.fn()
    };
    mockRouter = { navigateByUrl: jest.fn() }; // Añade aquí cualquier método de Router que necesites mockear

    // Pasar los mocks al constructor
    component = new ListTaskPageComponent(
      mockTaskService as TaskService,
      mockRouter as Router,
      mockAuthService as AuthService,
      mockFormBuilder as FormBuilder
    );
  });

  test('Debe estar creado el componente list-task-page', () => {
    expect(component).toBeTruthy();
  });

  it('Mostrar si todas las userTasks estan definidas en el ngOnInit', () => {
    component.ngOnInit();
    jest.spyOn(mockTaskService, 'getTasks').mockReturnValue([
      { 
        id: 'test-id',
        taskName: 'test',
        generateId: 'test-generateId',
        createdBy: 'test-createdBy',
        description: 'test',
        createAt: new Date(),
        limitDate: new Date('2023-12-31'),
        status: 'test',

      }
    ]);
    //espero que este definido el userTasks
    expect(component.userTasks).toBeDefined;
  });

  it('Prueba de eliminar task por el id', async () => {
    // Configurar los mocks, le doy valor de true al mock isLogged
    jest.spyOn(mockAuthService, 'isLogged').mockReturnValue(true);
    jest.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

    // Llamar a la función deleteTask
    await component.deleteTask(
      { 
        id: 'test-id',
        taskName: 'test1',
        generateId: 'test-generateId',
        createdBy: 'test-createdBy',
        description: 'test',
        createAt: new Date(),
        limitDate: new Date('2023-12-31'),
        status: 'test',
      });

    // Compruebo que se llamó al método deleteTask del servicio
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith('test-id');
  });

  });

