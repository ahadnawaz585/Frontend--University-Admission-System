import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelOfEducationData } from 'src/models/levelOfEducation.model';
import { LevelOfEducationService } from 'src/services/levelOfEducationService';

@Component({
  selector: 'app-level-of-education',
  templateUrl: './level-of-education.component.html',
  styleUrls: ['./level-of-education.component.css']
})
export class LevelOfEducationComponent implements OnInit {
  levelOfEducationForm!: FormGroup;
  levelsOfEducation: LevelOfEducationData[] = [];
  selectedLevel: LevelOfEducationData | null = null;
  isEditing = false;
  editLevelForm!: FormGroup;
  firstEntered = true;

  constructor(
    private fb: FormBuilder,
    private levelOfEducationService: LevelOfEducationService,

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadLevelsOfEducation();
  }

  initializeForm(): void {
    this.levelOfEducationForm = this.fb.group({
      levelName: ['', Validators.required],
      mandatoryYearsOfEducation: ['', Validators.required]
    });
  }

loadLevelsOfEducation(): void {
    this.levelOfEducationService.getLevelsOfEducation().subscribe(
      (levels) => {
        this.levelsOfEducation = levels.map((level) => {
          return {
            ...level,
            levelName: this.capitalizeFirstLetter(level.levelName),
          };
        });
        if (this.firstEntered) {
          this.levelsOfEducation.sort((a, b) => a.id - b.id); 
        } else {
          this.levelsOfEducation.sort((a, b) => b.id - a.id); 
        }

        this.initializeForm();
      },
      (error) => {
        console.error('Error fetching levels of education:', error);
      }
    );
  }

  capitalizeFirstLetter(str: string): string {
    return str.toUpperCase();
  }
  
  toggleSorting(): void {
    this.firstEntered = !this.firstEntered;
    this.loadLevelsOfEducation();
  }

  onSubmit(): void {
    if (this.levelOfEducationForm.valid) {
      const { levelName, mandatoryYearsOfEducation } = this.levelOfEducationForm.value;

      const parsedMandatoryYears = Number(mandatoryYearsOfEducation);

      this.levelOfEducationService.createLevelOfEducation(levelName, parsedMandatoryYears).subscribe(
        (response) => {
          console.log('Level of education created:', response);
          this.loadLevelsOfEducation();
          this.levelOfEducationForm.reset();
        },
        (error) => {
          console.error('Error creating level of education:', error);
        }
      );
    }
  }

  initializeEditForm(): void {
    this.editLevelForm = this.fb.group({
      levelName: ['', Validators.required],
      mandatoryYearsOfEducation: ['', Validators.required]
    });
  }

  deleteLevel(levelId: number): void {
    this.levelOfEducationService.deleteLevelOfEducation(levelId).subscribe(
      () => {
        console.log('Level of education deleted successfully');
        this.loadLevelsOfEducation();
      },
      (error) => {
        console.error('Error deleting level of education:', error);
      }
    );
  }

  editLevel(level: LevelOfEducationData): void {
    if (this.selectedLevel && this.selectedLevel.id === level.id && this.isEditing) {
      this.isEditing = false;
      this.selectedLevel = null;
      this.initializeForm();
    } else {
      this.selectedLevel = { ...level };
      this.isEditing = true;
      this.editLevelForm.patchValue({
        levelName: this.selectedLevel.levelName,
        mandatoryYearsOfEducation: this.selectedLevel.mandatoryYearsOfEducation
      });
    }
  }
  

  saveEditedLevel(): void {
    if (this.selectedLevel) {
      this.levelOfEducationService.updateLevelOfEducation(this.selectedLevel).subscribe(
        (response) => {
          console.log('Level of education updated:', response);
          this.isEditing = false;
          this.selectedLevel = null;
          this.loadLevelsOfEducation();
        },
        (error) => {
          console.error('Error updating level of education:', error);
        }
      );
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.selectedLevel = null;
    this.initializeForm();
  }
}
