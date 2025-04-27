import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard'; // <-- vamos a crearlo

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], 
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'vehiculos',
        loadComponent: () =>
          import('./pages/vehiculos/vehiculos.component').then(m => m.VehiculosComponent)
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./pages/citas/citas.component').then(m => m.CitasComponent)
      },
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
