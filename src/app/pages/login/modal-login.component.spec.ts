import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ModalLoginComponent } from './modal-login.component';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';

describe('ModalLoginComponent', () => {
  let component: ModalLoginComponent;
  let fixture: ComponentFixture<ModalLoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['autenticar']);
    const notificacionSpy = jasmine.createSpyObj('NotificacionService', ['abrirNotificacionExito', 'abrirNotificacionError']);
    const modalSpy = jasmine.createSpyObj('NzModalRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        NoopAnimationsModule,
        NzModalModule,
        NzIconModule
      ],
      providers: [
        ModalLoginComponent,
        { provide: AuthService, useValue: authSpy },
        { provide: NotificacionService, useValue: notificacionSpy },
        { provide: NzModalRef, useValue: modalSpy },
        { provide: NZ_ICONS, useValue: [UserOutline, LockOutline] }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalLoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificacionServiceSpy = TestBed.inject(NotificacionService) as jasmine.SpyObj<NotificacionService>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe crear el formulario de login al inicializar el componente', () => {
    expect(component.formularioLogin).toBeDefined();
    expect(component.formularioLogin.controls['username']).toBeDefined();
    expect(component.formularioLogin.controls['password']).toBeDefined();
  });

  it('Debe mostrar mensajes de error cuando los campos están vacíos', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;

    usernameInput.value = '';
    passwordInput.value = '';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameError = fixture.debugElement.query(By.css('nz-form-control[nzErrorTip]')).nativeElement;
    const passwordError = fixture.debugElement.query(By.css('#control-password')).nativeElement;
    expect(usernameError.textContent).toContain('Este campo es obligatorio');
    expect(passwordError.textContent).toContain('Este campo es obligatorio');
  });

  it('Debe llamar al método login al dar click en el botón Autenticarse y cuando el formulario es válido', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;

    usernameInput.value = 'testuser';
    passwordInput.value = 'password';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    authServiceSpy.autenticar.and.returnValue(of(void 0));

    const loginButton = fixture.debugElement.query(By.css('button[nzType="primary"]')).nativeElement;
    loginButton.click();

    expect(authServiceSpy.autenticar).toHaveBeenCalledWith('testuser', 'password');
  });

  it('Debe mostrar una notificación de éxito cuando el login es exitoso', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;

    usernameInput.value = 'testuser';
    passwordInput.value = 'password';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    authServiceSpy.autenticar.and.returnValue(of(void 0));

    const loginButton = fixture.debugElement.query(By.css('button[nzType="primary"]')).nativeElement;
    loginButton.click();

    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith('Autenticado correctamente');
  });

  it('Debe mostrar una notificación de error cuando el login falla', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;

    usernameInput.value = 'testuser';
    passwordInput.value = 'password';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    authServiceSpy.autenticar.and.returnValue(throwError(() => new Error('Error al autenticar')));

    const loginButton = fixture.debugElement.query(By.css('button[nzType="primary"]')).nativeElement;
    loginButton.click();

    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al autenticar');
  });
});
