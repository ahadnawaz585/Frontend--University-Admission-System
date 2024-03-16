import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import {MatStepperModule} from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field'
import {MatBadgeModule} from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatNativeDateModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './students/students.component';
import { LevelOfEducationComponent } from './level-of-education/level-of-education.component';
import { ProgramComponent } from './program/program.component';
import { CertificatesComponent } from './academicCertificates/certificates.component';
import { ApplicationComponent } from './application/application.component';
import { AdminComponent } from './admin/admin.component';
import { ApplicationHistoryComponent } from './application-history/application-history.component';
import { ApplicationPaymemtComponent } from './application-paymemt/application-paymemt.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'student', component: StudentsComponent },
  { path: 'levelOfEducation', component: LevelOfEducationComponent },
  { path: 'program', component: ProgramComponent },
  { path: 'certificate', component: CertificatesComponent },
  { path: 'application', component: ApplicationComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'applicationHistory', component: ApplicationHistoryComponent },
  { path: 'applicationPayment', component: ApplicationPaymemtComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    StudentsComponent,
    LevelOfEducationComponent,
    ProgramComponent,
    CertificatesComponent,
    ApplicationComponent,
    AdminComponent,
    ApplicationHistoryComponent,
    ApplicationPaymemtComponent,
    
  ],
  imports: [
    MatDatepickerModule,
    MatExpansionModule,
    MatStepperModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    LayoutModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatDialogModule 
    
    
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
