import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HealthProfileComponent } from '../health-profile/health-profile.component';
import { DependentProfilesComponent } from '../dependent-profiles/dependent-profiles.component';
import { MedicalDocumentsComponent } from '../medical-documents/medical-documents.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    HealthProfileComponent,
    DependentProfilesComponent,
    MedicalDocumentsComponent,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  selectedTab = 0;

  ngOnInit(): void {
    // Component initialized
  }
}
