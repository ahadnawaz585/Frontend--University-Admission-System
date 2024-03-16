import { Component, OnInit } from '@angular/core';
import { ApplicationData } from 'src/models/application.model';
import { ApplicationService } from 'src/services/applicationService';
import { applicationHistoryData } from 'src/models/applicationHistory.model';
import { appplicationHistoryService } from 'src/services/applicationHistoryService';
import { StudentService } from 'src/services/studentService';
import { studentData } from 'src/models/student.model';
import { adminData } from 'src/models/admin.model';
import { adminService } from 'src/services/adminService';

@Component({
  selector: 'app-application-history',
  templateUrl: './application-history.component.html',
  styleUrls: ['./application-history.component.css']
})
export class ApplicationHistoryComponent implements OnInit {
  histories: applicationHistoryData[] = [];
  applications: ApplicationData[] = [];
  students:studentData[]=[];
  admins: adminData[] = [];

  constructor(
    private applicationService: ApplicationService,
    private appHistoryService: appplicationHistoryService,
    private studentService: StudentService,
    private adminService: adminService 
    ){};

  ngOnInit(): void {
    this.loadApplications();
    this.loadHistories();
    this.loadStudents(); 
    this.loadAdmins(); 
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

  loadHistories(): void {
    this.appHistoryService.getApplicationHistory().subscribe(
      (histories: applicationHistoryData[]) => {
        this.histories = histories;
      },
      (error: any) => {
        console.error('Error fetching application histories:', error);
      }
    );
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe(
      (admins) => {
        this.admins = admins;
      },
      (error) => {
        console.error('Error fetching admins:', error);
      }
    );
  }

  getAdminNameById(adminId: number | undefined): string {
    const admin = this.admins.find((admin) => admin.id === adminId);
    return admin ? admin.name : 'Unknown';
  }
 }


