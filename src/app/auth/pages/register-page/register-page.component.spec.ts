import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterPageComponent } from './register-page.component';
import { User } from '../../interfaces/user.interface';


describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let mockFormBuilder: Partial<FormBuilder>;
  let mockAuthService: Partial<AuthService>;

  class MockFormBuilder extends FormBuilder {
    override group = jest.fn(() => ({
      // Aquí puedes agregar propiedades o métodos adicionales si es necesario
    })) as any; // Convertirlo a any para evitar errores de tipo
  }

  beforeEach(() => {
    const mockFormBuilder = new MockFormBuilder();
    mockAuthService = {
      getUsers: jest.fn(),
      addUser: jest.fn()
    };

    // Pasar los mocks al constructor
    component = new RegisterPageComponent (
      mockAuthService as AuthService,
      mockFormBuilder as FormBuilder
    );
  });

  test('Debe estar creado el componente register-page', () => {
    expect(component).toBeTruthy();
  });

  test('Debe estar inicializado el formulario de registro en ngOnInit', () => {
    component.ngOnInit();
    expect(component.registerForm).toBeTruthy();
  });

  test('Debe agregar un usuario si el mockNewUser, coincide con el expect', () => {
    //creo datos del mockNewUser
    const mockNewUser: User = {name: 'test',password: '123456' , email: 'test@test.com'};

    component.registerForm = new FormGroup({
      name: new FormControl(mockNewUser.name),
      password: new FormControl(mockNewUser.password),
      email: new FormControl(mockNewUser.email),
    });

    component.addUser();

    expect(mockAuthService.addUser).toHaveBeenCalledWith({
      name: 'test',
      password: '123456',
      email: 'test@test.com'
    });
  });

});
