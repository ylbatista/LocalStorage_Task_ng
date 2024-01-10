import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../services/auth.service';
import { ComponentFixture } from '@angular/core/testing';
import { User } from '../../interfaces/user.interface';



describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let mockFormBuilder: Partial<FormBuilder>;
  let mockRouter: Partial<Router>;
  let mockAuthService: Partial<AuthService>;
  let fixture: ComponentFixture<LoginPageComponent>;

  class MockFormBuilder extends FormBuilder {
    override group = jest.fn(() => ({
      // Aquí puedes agregar propiedades o métodos adicionales si es necesario
    })) as any; // Convertirlo a any para evitar errores de tipo
  }

  beforeEach(() => {
    const mockFormBuilder = new MockFormBuilder();
    
    mockRouter = { navigateByUrl: jest.fn() };
    mockAuthService = {
      getUsers: jest.fn(),
      saveUserLogged: jest.fn()
    };
  
    component = new LoginPageComponent(
      mockFormBuilder,
      mockRouter as Router,
      mockAuthService as AuthService
    );
  });

  test('Debe estar creado el componente login-page-component', () => {
    expect(component).toBeTruthy();
  });

  test('Debe inicializarse el form dentro del ngOnInit', () => {
    component.ngOnInit();
    expect(component.loginForm).toBeTruthy();
  });

  test('Debe navegar a task-list si el usuario está logado correctamente', () => {

    // Configuración inicial del mock para el usuario
    const mockUser: User = { name: 'Yuri', email: 'test@test.com', password: 'test' };
    
    // Inicializo y configuro el formulario de inicio de sesión
    component.loginForm = new FormGroup({
      email: new FormControl(mockUser.email),
      password: new FormControl(mockUser.password),
    });

    // Mock para el método getUsers de authService
    jest.spyOn(mockAuthService, 'getUsers').mockReturnValue([mockUser]);
    
    // Llamada al método onLogin
    component.onLogin();
    
    // Verifico de que navigateByUrl se llame con '/task-list'
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/task-list');
});


});
