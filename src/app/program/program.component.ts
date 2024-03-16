import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramData } from 'src/models/program.model';
import { ProgramService } from 'src/services/programService';
import { LevelOfEducationService } from 'src/services/levelOfEducationService';
import { LevelOfEducationData } from 'src/models/levelOfEducation.model';
import { certificateData } from 'src/models/certificate.model';
import { certificateService } from 'src/services/certificateService';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {
  programForm!: FormGroup;
  programs: ProgramData[] = [];
  selectedProgram: ProgramData | null = null;
  isEditing = false;
  editForm!: FormGroup;
  levelsOfEducation: LevelOfEducationData[] = [];
  certificates: certificateData[] = [];

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private levelService: LevelOfEducationService,
    private certificateService: certificateService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadPrograms();
     this.loadLevelsOfEducation();
     this.loadCertificates();
  }

  getLevelName(levelId: number): string {
    const level = this.levelsOfEducation.find((level) => level.id === levelId);
    return level ? level.levelName : 'Unknown';
  }

  getCertificiateName(certificateId: number): string {
    const certificate = this.certificates.find((certificate) => certificate.id ===certificateId);
    return certificate ? certificate.certificateName : 'Unknown';
  }
  
  loadLevelsOfEducation(): void {
    this.levelService.getLevelsOfEducation().subscribe(
      (levels: LevelOfEducationData[]) => { // Specify the type explicitly
        this.levelsOfEducation = levels;
      },
      (error: any) => { // Specify the type for the error
        console.error('Error fetching levels of education:', error);
      }
    );
  }
  
  loadCertificates(): void {
    this.certificateService.getCertificate().subscribe(
      (certificates: certificateData[]) => {
        this.certificates = certificates;
      },
      (error: any) => {
        console.error('Error fetching certificates:', error);
      }
    );
  }

  initializeForm(): void {
    this.programForm = this.fb.group({
      programName: ['', Validators.required],
      levelOfEducationId: ['', Validators.required],
      academicCertificateId: ['', Validators.required],
      programFee: ['', Validators.required],
      minimumMarksRequired: ['', Validators.required]
    });
  }
  

  loadPrograms(): void {
    this.programService.getPrograms().subscribe(
      (programs) => {
        this.programs = programs;
      },
      (error) => {
        console.error('Error fetching programs:', error);
      }
    );
  }

  editProgram(index: number) {
    this.selectedProgram = this.programs[index];
    this.programForm.patchValue({
      programName: this.selectedProgram.programName,
      levelOfEducationId: this.selectedProgram.levelOfEducationId,
      academicCertificateId: this.selectedProgram.academicCertificateId,
      programFee: this.selectedProgram.programFee,
      minimumMarksRequired: this.selectedProgram.minimumMarksRequired
    });
    this.isEditing = true; // Set the editing flag to true
  }
  
  onSubmit(): void {
    if (this.programForm.valid) {
      const programData: ProgramData = this.programForm.value;
  
      if (this.isEditing && this.selectedProgram) {
        programData.id = this.selectedProgram.id;
        programData.levelOfEducationId = +programData.levelOfEducationId;
        programData.academicCertificateId = +programData.academicCertificateId;
        programData.programFee = +programData.programFee;
        programData.minimumMarksRequired = +programData.minimumMarksRequired;
  
        this.programService.updateProgram(programData).subscribe(
          (response: any) => {
            console.log('Program updated:', response);
            this.isEditing = false;
            this.selectedProgram = null;
            this.loadPrograms();
            this.programForm.reset();
          },
          (error: any) => {
            console.error('Error updating program:', error);
          }
        );
      } else {
        programData.levelOfEducationId = +programData.levelOfEducationId;
        programData.academicCertificateId = +programData.academicCertificateId;
        programData.programFee = +programData.programFee;
        programData.minimumMarksRequired = +programData.minimumMarksRequired;
  
        this.programService.createProgram(programData).subscribe(
          (response) => {
            console.log('Program created:', response);
            this.loadPrograms();
            this.programForm.reset();
          },
          (error) => {
            console.error('Error creating program:', error);
          }
        );
      }
    }
  }
  

  deleteProgram(programId: number): void {
    this.programService.deleteProgram(programId).subscribe(
      () => {
        console.log('Program deleted successfully');
        this.loadPrograms();
      },
      (error) => {
        console.error('Error deleting program:', error);
      }
    );
  }
  
  saveEditedProgram(): void {
    if (this.selectedProgram) {
      const editedProgramData: ProgramData = this.editForm.value;
      editedProgramData.id = this.selectedProgram.id;
  
      editedProgramData.levelOfEducationId = +editedProgramData.levelOfEducationId;
  
      this.programService.updateProgram(editedProgramData).subscribe(
        (response: any) => {
          console.log('Program updated:', response);
          this.isEditing = false;
          this.selectedProgram = null;
          this.loadPrograms(); 
        },
        (error: any) => {
          console.error('Error updating program:', error);
        }
      );
    }
  }
  
  
  cancelEditing(): void {
    this.isEditing = false;
    this.selectedProgram = null;
    this.editForm.reset(); // Resetting the edit form
  }
  

}
