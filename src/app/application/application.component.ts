import { Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StudentService } from 'src/services/studentService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { studentData } from 'src/models/student.model';
import { previousEducationData } from 'src/models/previousEducation.model';
import { PreviousEducationService } from 'src/services/previousEducationService';
import { contactInfoData } from 'src/models/contactInfo.model';
import { contactInformationService } from 'src/services/contactInfoService';
import { ApplicationData } from 'src/models/application.model';
import { ApplicationService } from 'src/services/applicationService';
import { ProgramData } from 'src/models/program.model';
import { ProgramService } from 'src/services/programService';
import { priorityData } from 'src/models/priority.model';
import { priorityService } from 'src/services/priorityService';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit, OnDestroy {
  studentForm!: FormGroup;
  priorityForm!: FormGroup;
  educationForm!: FormGroup;
  submittedStudentForm: boolean = false;
  progressValue: number = 10;
  submittedStudentName: String | undefined;
  submittedPriorityForm: boolean = false;
  students: studentData[] = [];
  programs: ProgramData[] = [];
  applications: ApplicationData[] = [];
  panelOpenState = false;
  submitEducationForm: boolean = false;
  submitContactForm: boolean = false;
  contactForm!: FormGroup;
  admissionForm: boolean = true;
  submittedStudentId: number | undefined;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;


  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private educationService: PreviousEducationService,
    private programService: ProgramService,
    private contactService: contactInformationService,
    private applicationService: ApplicationService,
    private priorityService: priorityService,
    private _snackBar: MatSnackBar,


  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadStudents();
    this.loadPrograms();
  }

  initializeForms(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      picture: ['data:image/png;base64,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', Validators.required],
      fatherName: ['', Validators.required],
      age: ['', Validators.required],
      dob: ['', Validators.required],
      citizen: ['', Validators.required],
      religion: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.educationForm = this.fb.group({
      schoolName: ['', Validators.required],
      schoolProgram: ['', Validators.required],
      schoolMarks: ['', Validators.required],
      collegeName: ['', Validators.required],
      collegeProgram: ['', Validators.required],
      collegeMarks: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.priorityForm = this.fb.group({
      priority1: ['', Validators.required],
      priority2: ['', Validators.required],
      priority3: ['', Validators.required],
    }, { validator: this.prioritiesShouldBeDifferent() });
  }

  scrollToTop(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = 0;
      } else {
        console.error('Scroll container not found.');
      }
    } catch (err) {
      console.error(err);
    }
  }



  ngOnDestroy() {
    if (!this.submittedPriorityForm) {
      if (this.submittedStudentName) {
        const foundStudent = this.students.find(student => student.name === this.submittedStudentName);

        if (foundStudent && foundStudent.id !== undefined) {
          this.submittedStudentId = foundStudent.id;
        }

        if (this.submittedStudentId !== undefined) {
          this.deleteStudent(this.submittedStudentId);
        } else {
          console.error('Submitted student ID is undefined');
        }
      }
    }
  }

  deleteStudent(studentId: number) {
    this.studentService.deleteStudent(studentId).subscribe(
      () => {
        console.log('Student deleted successfully');
        this.loadStudents(); // Load students after deletion
        this._snackBar.open('Application is not created!', 'Close', {
          duration: 3000 // 3 seconds
        });
      },
      (error: any) => {
        console.error('Error deleting student:', error);
      }
    );
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

  onSubmitApplication(): void {
    this.loadStudents();

    const foundStudent = this.students.find(student => student.name === this.submittedStudentName);
    if (foundStudent && foundStudent.id !== undefined) {
      this.submittedStudentId = foundStudent.id;
      if (this.submitEducationForm && this.submittedStudentForm && this.submitContactForm) {
        const newApplication: ApplicationData = {
          studentId: this.submittedStudentId,
          applicationDate: new Date(),
          applicationFee: 2500,
          status: 'Pending',
        };

        this.applicationService.createApplication(newApplication).subscribe(
          (response) => {
          },

          (error) => {
            console.error('Error creating application:', error);
          }
        );
      }
    }
    this.loadApplications();
  }

  prioritiesShouldBeDifferent(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const priority1 = formGroup.get('priority1')?.value;
      const priority2 = formGroup.get('priority2')?.value;
      const priority3 = formGroup.get('priority3')?.value;

      if (priority1 !== undefined && priority2 !== undefined && priority3 !== undefined) {
        const priorities = [priority1, priority2, priority3];

        if (new Set(priorities).size !== priorities.length) {
          return { prioritiesNotDistinct: true };
        }
      }

      return null;
    };
  }

  onSubmitPriortyForm() {
    this.loadApplications();
    setTimeout(() => {
      this.progressValue += 25;
      const foundApplication: ApplicationData | undefined = this.applications.find(application => application.studentId == this.submittedStudentId);
      if (foundApplication != undefined && foundApplication.id !== undefined) {
        const generatedApplicationId = foundApplication.id;
        const priority1: priorityData = {
          applicationId: generatedApplicationId,
          programId: this.priorityForm.get('priority1')?.value,
          priority: 1,
        };
        const priority2: priorityData = {
          applicationId: generatedApplicationId,
          programId: this.priorityForm.get('priority2')?.value,
          priority: 2,
        };
        const priority3: priorityData = {
          applicationId: generatedApplicationId,
          programId: this.priorityForm.get('priority3')?.value,
          priority: 3,
        };
        this.priorityService.createPriorities(priority1).subscribe(
          (response) => {
          },
          (error) => {
            console.error('Error creating priority 1:', error);
          }
        );

        this.priorityService.createPriorities(priority2).subscribe(
          (response) => {
          },
          (error) => {
            console.error('Error creating priority 2:', error);
          }
        );

        this.priorityService.createPriorities(priority3).subscribe(
          (response) => {
          },
          (error) => {
            console.error('Error creating priority 3:', error);
          }
        );
        this._snackBar.open('Application created successfully!', 'Close', {
          duration: 3000
        });
        this.admissionForm = false;

        this.submittedPriorityForm = true;
      } else {
        console.log("it is undefined");
      }
    }, 500);
  }
  loadApplications(): void {
    this.applicationService.getApplications().subscribe(
      (applications: ApplicationData[]) => {
        this.applications = applications;
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
  }



  onSubmitStudent(): void {
    if (this.studentForm.valid) {
      const studentInfo: studentData = this.studentForm.value as studentData;
      const submittedName: string = studentInfo.name;
      this.submittedStudentName = submittedName;
      this.studentService.createStudent(studentInfo).subscribe(
        (response) => {

          this.progressValue += 25;
          this.submittedStudentForm = true;
          this.loadStudents();
          this._snackBar.open('Student information submitted successfully!', 'Close', {
            duration: 3000
          });
          this.scrollToTop();
        },
        (error) => {
          console.error('Error submitting student information:', error);
        }
      );
    }
  }


  onSubmitEducation(): void {
    if (this.educationForm.valid) {
      const submittedStudent = this.students.find(
        (student) => student.name === this.submittedStudentName
      );

      if (submittedStudent) {
        const educationInfo: previousEducationData = {
          ...this.educationForm.value,
          studentId: submittedStudent.id
        };
        this.educationService.createPreviousEducation(educationInfo).subscribe(
          (response) => {
            this.progressValue += 25;
            this.submitEducationForm = true;
            this._snackBar.open('Educational information submitted successfully!', 'Close', {
              duration: 3000 // 3 seconds
            });
            this.scrollToTop();
          },
          (error) => {
            console.error('Error submitting educational information:', error);
          }
        );
      } else {
        console.error('Submitted student not found in the list');
      }
    }
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe((students: studentData[]) => {
      this.students = students;
    });
  }

  onSubmitContact() {
    if (this.contactForm.valid) {
      const submittedStudent = this.students.find(
        (student) => student.name === this.submittedStudentName
      );
      if (submittedStudent) {
        const contactInfo: contactInfoData = {
          ...this.contactForm.value,
          studentId: submittedStudent.id
        };
        this.contactService.createStudentInformation(contactInfo).subscribe(
          (response) => {
            this.progressValue += 25;
            this.submitContactForm = true;
            this._snackBar.open('Contact information submitted successfully!', 'Close', {
              duration: 3000 // 3 seconds
            });
            this.scrollToTop();

            // Create the application
            this.onSubmitApplication();

          },
          (error) => {
            console.error('Error submitting contact information:', error);
          }
        );
      } else {
        console.error('Submitted student not found in the list');
      }
    }
  }


  onCancel(): void {

    this.loadStudents();
    const foundStudent = this.students.find(student => student.name === this.submittedStudentName);
    if (foundStudent && foundStudent.id !== undefined) {
      if (this.submittedStudentId) {
        this.studentService.deleteStudent(foundStudent.id).subscribe(
          () => {
            this.submittedStudentForm = false;
            this.submitEducationForm = false;
            this.submitContactForm = false;
            this.studentForm.reset();
            this.educationForm.reset();
            this.contactForm.reset();
            this._snackBar.open('Application cancelled!', 'Close');
          },
          (error) => {
            this._snackBar.open('Failed to delete student. Please try again later.', 'Close');
          }
        );
      }
    }
  }

  printChallan() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
      </head>
      <style>* {
        box-sizing: border-box;
    }
      /* general styling */
    body {
        font-family: "Open Sans", sans-serif;
    }
      /* Create four equal columns that floats next to each other */
    .column {
        float: left;
        width: 25%;
        padding: 10px;
        border-right: 1px dotted #000;
        height: 100%; /* Should be removed. Only for demonstration */
    }
    
      /* Clear floats after the columns */
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
    .d-flex{
        display: flex;
    }
    .flex-col{
        flex-direction: column;
    }
    .justify-content-between{
        justify-content: space-between;
    }
    .justify-content-center{
        justify-content: center;
    }
    .justify-content-end{
        justify-content: end;
    }
    .float-right{
        float: right;
    }
    .float-left{
        float: left;
    }
    .circle-logo{
        width: 60px;
    }
    .logo{
        width: 220px;
    }
    .title{
        margin-top: 5px;
    }
    .student-name{
        margin-bottom: 10px;
    }
    .bar-code{
        width: 200px;
        align-self: center;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .align-center{
        align-self: center;
    }
    /*table*/
    table {
        margin-top: 10px;
        border: 1px solid #ccc;
        border-collapse: collapse;
        margin: 0;
        padding: 0;
        width: 100%;
        table-layout: fixed;
    }
    table tr {
        background-color: #fff;
        border: 1px solid #000;
        padding: .35em;
    }
    table th,
    table td {
        padding: .625em;
        border: 1px solid #000;
    }
    /*table end*/
    hr{
        border-top: 1px solid #000;
    }</style>
      <body>
      <div class="row">
          <div class="column">
              <div class="d-flex justify-content-between">
                  <strong>Invoice # INV/2022</strong>
                  <strong>Student Copy</strong>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <h4 class="align-center title">Quran Education Online</h4>
              </div>
              <div class="d-flex justify-content-between">
                  <div class="d-flex flex-col">
                      <span>Due Date:</span>
                      <span>08/09/2022</span>
                  </div>
                  <div class="d-flex flex-col">
                      <span>Account: 75-HBL</span>
                      <span>HMC Taxila</span>
                  </div>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <img src="https://i.ibb.co/c8CQvBq/barcode.png" alt="bar code" class="bar-code"/>
              </div>
              <table>
                  <thead>
                      <tr>
                      <th scope="col left" colspan="2">Description</th>
                      <th scope="col right">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                      <td data-label="Account" colspan="2">Electricity-319315001<br/>Consumption</td>
                      <td data-label="Amount">500.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Water-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">100.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Rent-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">13930.0</td>
                      </tr>
                  </tbody>
              </table>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable by due date</strong>
                  <span>Rs. 14,530</span>
              </div>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable after due date</strong>
                  <span>14,580.0</span>
              </div>
              <br/>
              <hr/>
              <div class="d-flex flex-col">
                  <span>For Bank Use Only</span>
                  <span>Received Payment Rs.</span>
              </div><br/>
              <div class="d-flex flex-col float-right">
                  <span>Signature and Stamp</span>
                  <span>Bank Officer</span>
              </div><br/><br/>
              <div class="d-flex">
                  <span>Date:</span>
                  <span>______________</span>
              </div>
      
          </div>
        <div class="column">
              <div class="d-flex justify-content-between">
                  <strong>Invoice # INV/2022</strong>
                  <strong>Student Copy</strong>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <h4 class="align-center title">Quran Education Online</h4>
              </div>
              <div class="d-flex justify-content-between">
                  <div class="d-flex flex-col">
                      <span>Due Date:</span>
                      <span>08/09/2022</span>
                  </div>
                  <div class="d-flex flex-col">
                      <span>Account: 75-HBL</span>
                      <span>HMC Taxila</span>
                  </div>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <img src="https://i.ibb.co/c8CQvBq/barcode.png" alt="bar code" class="bar-code"/>
              </div>
              <table>
                  <thead>
                      <tr>
                      <th scope="col left" colspan="2">Description</th>
                      <th scope="col right">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                      <td data-label="Account" colspan="2">Electricity-319315001<br/>Consumption</td>
                      <td data-label="Amount">500.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Water-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">100.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Rent-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">13930.0</td>
                      </tr>
                  </tbody>
              </table>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable by due date</strong>
                  <span>Rs. 14,530</span>
              </div>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable after due date</strong>
                  <span>14,580.0</span>
              </div>
              <br/>
              <hr/>
              <div class="d-flex flex-col">
                  <span>For Bank Use Only</span>
                  <span>Received Payment Rs.</span>
              </div><br/>
              <div class="d-flex flex-col float-right">
                  <span>Signature and Stamp</span>
                  <span>Bank Officer</span>
              </div><br/><br/>
              <div class="d-flex">
                  <span>Date:</span>
                  <span>______________</span>
              </div>
      
          </div>
        <div class="column">
              <div class="d-flex justify-content-between">
                  <strong>Invoice # INV/2022</strong>
                  <strong>Student Copy</strong>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <h4 class="align-center title">Quran Education Online</h4>
              </div>
              <div class="d-flex justify-content-between">
                  <div class="d-flex flex-col">
                      <span>Due Date:</span>
                      <span>08/09/2022</span>
                  </div>
                  <div class="d-flex flex-col">
                      <span>Account: 75-HBL</span>
                      <span>HMC Taxila</span>
                  </div>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <img src="https://i.ibb.co/c8CQvBq/barcode.png" alt="bar code" class="bar-code"/>
              </div>
              <table>
                  <thead>
                      <tr>
                      <th scope="col left" colspan="2">Description</th>
                      <th scope="col right">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                      <td data-label="Account" colspan="2">Electricity-319315001<br/>Consumption</td>
                      <td data-label="Amount">500.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Water-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">100.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Rent-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">13930.0</td>
                      </tr>
                  </tbody>
              </table>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable by due date</strong>
                  <span>Rs. 14,530</span>
              </div>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable after due date</strong>
                  <span>14,580.0</span>
              </div>
              <br/>
              <hr/>
              <div class="d-flex flex-col">
                  <span>For Bank Use Only</span>
                  <span>Received Payment Rs.</span>
              </div><br/>
              <div class="d-flex flex-col float-right">
                  <span>Signature and Stamp</span>
                  <span>Bank Officer</span>
              </div><br/><br/>
              <div class="d-flex">
                  <span>Date:</span>
                  <span>______________</span>
              </div>
      
          </div>
        <div class="column">
              <div class="d-flex justify-content-between">
                  <strong>Invoice # INV/2022</strong>
                  <strong>Student Copy</strong>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <h4 class="align-center title">Quran Education Online</h4>
              </div>
              <div class="d-flex justify-content-between">
                  <div class="d-flex flex-col">
                      <span>Due Date:</span>
                      <span>08/09/2022</span>
                  </div>
                  <div class="d-flex flex-col">
                      <span>Account: 75-HBL</span>
                      <span>HMC Taxila</span>
                  </div>
              </div>
              <div class="d-flex flex-col justify-content-center">
                  <img src="https://i.ibb.co/c8CQvBq/barcode.png" alt="bar code" class="bar-code"/>
              </div>
              <table>
                  <thead>
                      <tr>
                      <th scope="col left" colspan="2">Description</th>
                      <th scope="col right">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                      <td data-label="Account" colspan="2">Electricity-319315001<br/>Consumption</td>
                      <td data-label="Amount">500.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Water-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">100.0</td>
                      </tr>
                      <tr>
                      <td scope="row" data-label="Account" colspan="2">Rent-319315001<br/>Fix Charges</td>
                      <td data-label="Amount">13930.0</td>
                      </tr>
                  </tbody>
              </table>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable by due date</strong>
                  <span>Rs. 14,530</span>
              </div>
              <hr/>
              <div class="d-flex justify-content-between">
                  <strong>Payable after due date</strong>
                  <span>14,580.0</span>
              </div>
              <br/>
              <hr/>
              <div class="d-flex flex-col">
                  <span>For Bank Use Only</span>
                  <span>Received Payment Rs.</span>
              </div><br/>
              <div class="d-flex flex-col float-right">
                  <span>Signature and Stamp</span>
                  <span>Bank Officer</span>
              </div><br/><br/>
              <div class="d-flex">
                  <span>Date:</span>
                  <span>______________</span>
              </div>
      
          </div>
      </div>
      </body>
      </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }

}
