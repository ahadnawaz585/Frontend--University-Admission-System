import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { paymentData } from 'src/models/payment.model';
import { paymentService } from 'src/services/paymentService';
import { ApplicationService } from 'src/services/applicationService';
import { appplicationHistoryService } from 'src/services/applicationHistoryService';
import { applicationHistoryData } from 'src/models/applicationHistory.model';
import { ApplicationData } from 'src/models/application.model';
import { studentData } from 'src/models/student.model';
import { StudentService } from 'src/services/studentService';

@Component({
  selector: 'app-application-paymemt',
  templateUrl: './application-paymemt.component.html',
  styleUrls: ['./application-paymemt.component.css']
})
export class ApplicationPaymemtComponent implements OnInit {
  paymentForm!: FormGroup;
  payments: paymentData[] = [];
  students:studentData[]=[];
  applications:ApplicationData[]=[];
  selectedPayment: paymentData | null = null;
  isEditing = false;
  paid:boolean=false;

  constructor(
    private fb: FormBuilder,
    private paymentService: paymentService,
    private applicationService: ApplicationService,
    private appHistoryService: appplicationHistoryService,
    private studentService: StudentService
    ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPayments();
    this.loadApplications(); 
    this.loadStudents();
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({
      applicationId: [null, Validators.required],
      paymentDate: [null, Validators.required],
      bankName: ['', Validators.required],
      amountPaid: [null, Validators.required]
    });
  }

  loadPayments(): void {
    this.paymentService.getPayment().subscribe(
      (payments: paymentData[]) => {
        this.payments = payments;
      },
      (error: any) => {
        console.error('Error fetching payments:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData: paymentData = this.paymentForm.value;
  
      if (this.isEditing && this.selectedPayment) {
        paymentData.id = this.selectedPayment.id;
        this.paymentService.updatePayment(paymentData).subscribe(
          (response: any) => {
            console.log('Payment updated:', response);
            this.isEditing = false;
            this.selectedPayment = null;
            this.loadPayments();
            this.paymentForm.reset();
            if(paymentData.amountPaid >=2500){
              this.paid = true;
            this.updateApplicationStatus(paymentData.applicationId,this.paid);
            this.createHistory(paymentData.applicationId, 'Pending', 'Approved');
          } else{
            this.updateApplicationStatus(paymentData.applicationId,this.paid);
            this.createHistory(paymentData.applicationId, 'Pending', 'Rejected');
          }
       
        },
          (error: any) => {
            console.error('Error updating payment:', error);
          }
        );
      } else {
        this.paymentService.createPayment(paymentData).subscribe(
          (response: any) => {
            this.loadPayments();
            this.paymentForm.reset();
            if(paymentData.amountPaid>2500){
              this.paid = true;
              this.updateApplicationStatus(paymentData.applicationId,this.paid);
              this.createHistory(paymentData.applicationId, 'Pending', 'Approved');
            } else  {
              this.paid =false;
              this.updateApplicationStatus(paymentData.applicationId,this.paid);
              this.createHistory(paymentData.applicationId, 'Pending', 'Rejected');
            }
            this.isEditing = false;
            this.selectedPayment = null;
          },
          (error: any) => {
            console.error('Error creating payment:', error);
          }
        );
      }
    }
  }
  
  loadApplications(): void {
    this.applicationService.getApplications().subscribe(
      (applications) => {
        this.applications = applications;
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
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

  getStudentNameByApplicantId(applicantId: number|undefined): string {
    
    const application = this.applications.find(application => application.id === applicantId);
    if (application) {
      const studentId = application.studentId;
      const student = this.students.find(student => student.id === studentId);
      return student ? student.name : 'Unknown';
    }
    return 'Unknown';
  }
  

updateApplicationStatus(applicationId:number,paidStatus:boolean){
  if(paidStatus ==true){
  this.applicationService.updateApplicationStatus(applicationId, 'Approved').subscribe(
    (response: any) => {
    },
    (error: any) => {}
  )
  } else{
    this.applicationService.updateApplicationStatus(applicationId, 'Rejected').subscribe(
      (response: any) => {
      },
      (error: any) => {}
    )
  }
}

createHistory(applicationId: number, statusFrom: string, statusTo: string): void {
  const historyData: applicationHistoryData = {
    applicationId,
    statusFrom,
    statusTo,
    dateOfChange: new Date(),
    adminId:3,
  };

  this.appHistoryService.createApplicationHistory(historyData).subscribe(
    (response: any) => {
      console.log('Application history created:', response);
    },
    (error: any) => {
      console.error('Error creating application history:', error);
    }
  );
}

  editPayment(index: number): void {
    this.selectedPayment = this.payments[index];
    this.paymentForm.patchValue({
      applicationId: this.selectedPayment.applicationId,
      paymentDate: this.selectedPayment.paymentDate,
      bankName: this.selectedPayment.bankName,
      amountPaid: this.selectedPayment.amountPaid
    });
    this.isEditing = true;
  }

  deletePayment(paymentId: number | undefined): void {
    if (paymentId !== undefined) {
      this.paymentService.deletePayment(paymentId).subscribe(
        () => {
          this.loadPayments();
        },
        (error: any) => {
          console.error('Error deleting payment:', error);
        }
      );
    } else {
      console.error('Invalid payment ID');
    }
  }
  
}



