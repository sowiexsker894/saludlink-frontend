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
import { HealthProfileComponent } from './features/health-profile/health-profile.component';
import { MentalHealthTestComponent } from './features/mental-health-test/mental-health-test.component';
import { AdherenceDashboardComponent } from './features/adherence-dashboard/adherence-dashboard.component';
import { MedicalDocumentsComponent } from './features/medical-documents/medical-documents.component';
import { DependentProfilesComponent } from './features/dependent-profiles/dependent-profiles.component';
import { PaymentConsultationComponent } from './features/payment-consultation/payment-consultation.component';
import { RatingReviewComponent } from './features/rating-review/rating-review.component';
import { AlertSettingsComponent } from './features/alert-settings/alert-settings.component';
import { PostConsultationChatComponent } from './features/post-consultation-chat/post-consultation-chat.component';
import { TelehealthVideoComponent } from './features/telehealth-video/telehealth-video.component';
import { DoctorProfileViewComponent } from './features/doctor-profile-view/doctor-profile-view.component';

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
      // HU02: Configuración de perfil
      { path: 'health-profile', component: HealthProfileComponent },
      // HU05: Telehealth
      { path: 'telehealth', component: TelehealthVideoComponent },
      // HU08: Documentos médicos
      { path: 'documents', component: MedicalDocumentsComponent },
      // HU09: Test de salud mental
      { path: 'mental-health', component: MentalHealthTestComponent },
      // HU10: Ver perfil del médico
      { path: 'doctor/:id', component: DoctorProfileViewComponent },
      // HU12: Tablero de adherencia
      { path: 'adherence', component: AdherenceDashboardComponent },
      // HU15: Perfiles dependientes
      { path: 'dependents', component: DependentProfilesComponent },
      // HU16: Pago de consultas
      { path: 'payment', component: PaymentConsultationComponent },
      // HU17: Calificación y reseñas
      { path: 'rating', component: RatingReviewComponent },
      // HU18 & HU19: Alertas y emergencia
      { path: 'alerts', component: AlertSettingsComponent },
      // HU20: Chat post-consulta
      { path: 'chat', component: PostConsultationChatComponent },
    ],
  },
];
