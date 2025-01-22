import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { MenuFoldOutline, MenuUnfoldOutline, ControlOutline, ProductOutline } from '@ant-design/icons-angular/icons';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { of } from 'rxjs';

import { AuthService } from './services/auth.service';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['usuario$', 'logout', 'isAdministrador']);
    authServiceSpy.usuario$ = of({ username: 'testuser', rol: 'admin' });

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NZ_ICONS, useValue: [MenuFoldOutline, MenuUnfoldOutline, ControlOutline, ProductOutline] }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe tener el titulo "Gestion Inventarios"', () => {
    expect(component.title).toEqual('Gestion Inventarios');
  });

  it('Debe cambiar el colapsado isCollapsed cuando sea clicked', () => {
    const headerTrigger = fixture.debugElement.query(By.css('.header-trigger'));
    headerTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.isCollapsed).toBeTrue();

    headerTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.isCollapsed).toBeFalse();
  });

  it('Debe mostrar el username en el header', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const usernameElement = fixture.debugElement.query(By.css('#nombre-username')).nativeElement;
    expect(usernameElement.textContent).toContain('Hola! testuser');
  }));

  it('Debe invocar el metodo logout al ejecutar el ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('Debe retornar verdadero para isAdministrador si el usuario es admin', () => {
    authServiceSpy.isAdministrador.and.returnValue(true);
    expect(component.isAdministrador).toBeTrue();
  });

  it('Debe retornar false para isAdministrador si el usuario no es admin', () => {
    authServiceSpy.isAdministrador.and.returnValue(false);
    expect(component.isAdministrador).toBeFalse();
  });

  it('Debe mostrar "Gestión Administrativa" en el menu si el usuario es admin', () => {
    authServiceSpy.isAdministrador.and.returnValue(true);
    fixture.detectChanges();
    const submenuTitle = fixture.debugElement.query(By.css('#submenu-inicio')).nativeElement;
    expect(submenuTitle.textContent).toContain('Gestión Administrativa');
  });

  it('Debe mostrar "Inventario" en el menu si el usuario no es admin', () => {
    authServiceSpy.isAdministrador.and.returnValue(false);
    fixture.detectChanges();
    const submenuTitle = fixture.debugElement.query(By.css('#submenu-inicio')).nativeElement;
    expect(submenuTitle.textContent).toContain('Inventario');
  });

  it('Debe mostrar "Categorías" en el menú', () => {
    fixture.detectChanges();
    const categoriasMenuItem = fixture.debugElement.query(By.css('#item-categorias'));
    expect(categoriasMenuItem).toBeTruthy();
    const linkElement = categoriasMenuItem.query(By.css('a')).nativeElement;
    expect(linkElement.getAttribute('routerLink')).toBe('/categorias');
  });

  it('Debe mostrar "Productos" en el menu si el usuario no es admin', () => {
    authServiceSpy.isAdministrador.and.returnValue(false);
    fixture.detectChanges();
    const productosMenuItem = fixture.debugElement.query(By.css('#item-productos'));
    expect(productosMenuItem).toBeTruthy();
    const linkElement = productosMenuItem.query(By.css('a')).nativeElement;
    expect(linkElement.getAttribute('routerLink')).toBe('/productos');
  });

  it('Debe mostrar "Clientes" en el menu si el usuario es admin', () => {
    authServiceSpy.isAdministrador.and.returnValue(true);
    fixture.detectChanges();
    const clientesMenuItem = fixture.debugElement.query(By.css('#item-clientes'));
    expect(clientesMenuItem).toBeTruthy();
    const linkElement = clientesMenuItem.query(By.css('a')).nativeElement;
    expect(linkElement.getAttribute('routerLink')).toBe('/clientes');
  });
});
