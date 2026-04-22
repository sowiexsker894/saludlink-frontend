import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { MedicationService } from '../../core/services/medication.service';
import { Appointment } from '../../core/models/appointment.model';
import { Medication } from '../../core/models/medication.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private medicationService = inject(MedicationService);
  private fb = inject(FormBuilder);

  // Data
  appointments: Appointment[] = [];
  medications: Medication[] = [];
  upcomingAppointments: Appointment[] = [];
  activeMedications: Medication[] = [];

  // Form
  contactForm!: FormGroup;

  // Loading & Error states
  appointmentsLoading = true;
  medicationsLoading = true;
  appointmentsError = false;
  medicationsError = false;
  contactSubmitting = false;

  // Plans
  plans = [
    {
      id: 1,
      name: 'Plan Pessoal',
      price: 0,
      icon: '🏥',
      features: [
        'Acceso a citas médicas',
        'Historial médico personal',
        'Recordatorios de medicinas',
        'Soporte básico',
      ],
      cta: 'Empezar gratis',
      highlighted: false,
    },
    {
      id: 2,
      name: 'Plan Clínico',
      price: 99,
      icon: '⚕️',
      features: [
        'Todas las características del plan personal',
        'Citas de telemedicina',
        'Historial médico compartido',
        'Soporte prioritario',
      ],
      cta: 'Contratar ahora',
      highlighted: true,
    },
  ];

  // Services info
  services = [
    {
      icon: '📋',
      title: 'Gestión de Citas',
      description: 'Agenda, modifica y cancela tus citas médicas de forma rápida',
    },
    {
      icon: '💊',
      title: 'Recomendaciones',
      description: 'Recibe recomendaciones personalizadas para tu salud',
    },
    {
      icon: '📊',
      title: 'Historial Clínico',
      description: 'Accede a todo tu historial médico desde cualquier lugar',
    },
    {
      icon: '🧠',
      title: 'Salud Mental',
      description: 'Soporte profesional para tu bienestar mental',
    },
  ];

  ngOnInit(): void {
    this.loadData();
    this.initContactForm();
  }

  private loadData(): void {
    this.loadAppointments();
    this.loadMedications();
  }

  private loadAppointments(): void {
    this.appointmentsLoading = true;
    this.appointmentService.getAppointmentsByPatient().subscribe({
      next: (data) => {
        this.appointments = data;
        this.upcomingAppointments = this.getUpcomingAppointments(data);
        this.appointmentsLoading = false;
      },
      error: () => {
        this.appointmentsError = true;
        this.appointmentsLoading = false;
      },
    });
  }

  private loadMedications(): void {
    this.medicationsLoading = true;
    this.medicationService.getMedicationsByPatient().subscribe({
      next: (data) => {
        this.medications = data;
        this.activeMedications = data.filter((m) => m.active);
        this.medicationsLoading = false;
      },
      error: () => {
        this.medicationsError = true;
        this.medicationsLoading = false;
      },
    });
  }

  private getUpcomingAppointments(appointments: Appointment[]): Appointment[] {
    const now = new Date();
    return appointments
      .filter((apt) => new Date(apt.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 3);
  }

  private initContactForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onContactSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }

    this.contactSubmitting = true;
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', this.contactForm.value);
      this.contactForm.reset();
      this.contactSubmitting = false;
      alert('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
    }, 1500);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
