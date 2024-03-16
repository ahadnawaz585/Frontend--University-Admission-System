import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/services/studentService';
import { studentData } from 'src/models/student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  studentForm!: FormGroup;
  editForm!: FormGroup;
  students: studentData[] = [];
  deletionSuccess = false;
  selectedStudent: studentData | null = null;
  isEditing = false;
  serialNumbers: number[] = [];
  isAscending: boolean = true;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadStudents();
  }

  initializeForms(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      picture: ['data:image/png;base64,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', Validators.required],
      age: ['', Validators.required],
      dob: ['', Validators.required],
      citizen: ['', Validators.required],
      religion: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      picture: ['', Validators.required],
      age: ['', Validators.required],
      dob: ['', Validators.required],
      citizen: ['', Validators.required],
      religion: ['', Validators.required],
      address: ['', Validators.required]
    });
  }
  updateSerialNumbers(): void {
    this.serialNumbers = Array(this.students.length)
      .fill(0)
      .map((x, i) => i + 1);
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe(
      (students) => {
        this.students = students;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
  
  
  
  capitalizeFirstLetter(student: studentData): studentData {
    student.name = student.name.charAt(0).toUpperCase() + student.name.slice(1).toLowerCase();
    return student;
  }
  

  onSubmit(): void {
    if (this.studentForm.valid) {
      if (this.isEditing && this.selectedStudent) {

        const updatedStudent: studentData = {
          id: this.selectedStudent.id, 
          ...this.studentForm.value
        };

        this.studentService.updateStudent(updatedStudent).subscribe(
          () => {
            console.log('Student updated successfully');
            this.isEditing = false;
            this.selectedStudent = null;
            this.studentForm.reset();
            this.loadStudents();
          },
          (error) => {
            console.error('Error updating student:', error);
          }
        );
      } else {
        // Add new student
        const newStudent: studentData = { ...this.studentForm.value };

        this.studentService.createStudent(newStudent).subscribe(
          () => {
            console.log('Student added successfully');
            this.studentForm.reset();
            this.loadStudents();
          },
          (error) => {
            console.error('Error adding student:', error);
          }
        );
      }
    }
  }
  
  


  deleteStudent(studentId: number): void {
    this.studentService.deleteStudent(studentId).subscribe(
      () => {
        console.log('Student deleted successfully');
        this.loadStudents();
      },
      (error: any) => {
        console.error('Error deleting student:', error);
      }
    );
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.selectedStudent = null;
    this.studentForm.reset();
  }

  editStudent(student: studentData): void {
    this.isEditing = true;
    this.selectedStudent = student;
    this.studentForm.patchValue(student); // Fill the form with the selected student's details
  }
  

  
  saveEditedStudent(): void {
    if (this.selectedStudent) {
      this.studentService.updateStudent(this.selectedStudent).subscribe(
        (response) => {

          this.isEditing = false;
          this.loadStudents();
        },
        (error) => {
          console.error('Error updating student:', error);
        }
      );
    }
  }

  
}
