import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppointmentsListComponent } from './features/appointments/appointments-list/appointments-list';
import { AppointmentFormComponent } from './features/appointments/appointment-form/appointment-form';
import { AppointmentsShellComponent } from './features/appointments/appointments-shell/appointments-shell';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { MedicationsComponent } from './features/medications/medications';
import { ProfileComponent } from './features/profile/profile';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [{ path: '', component: LoginComponent }],
  },
  {
    path: 'register',
    component: AuthLayoutComponent,
    children: [{ path: '', component: RegisterComponent }],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'appointments',
        component: AppointmentsShellComponent,
        children: [
          { path: '', pathMatch: 'full', component: AppointmentsListComponent },
          { path: 'nueva', component: AppointmentFormComponent },
        ],
      },
      { path: 'medications', component: MedicationsComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];
