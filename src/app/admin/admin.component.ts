import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adminService } from 'src/services/adminService';
import { adminData } from 'src/models/admin.model'; 

@Component({
  selector: 'app-admins', 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'] 
})
export class AdminComponent implements OnInit {
  adminForm!: FormGroup;
  admins: adminData[] = []; 
  deletionSuccess = false;
  selectedAdmin: any | null = null;
  isEditing = false;
  serialNumbers: number[] = [];
  isAscending: boolean = true;

  constructor(
    private fb: FormBuilder,
    private adminService: adminService, 
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAdmins(); 
  }

  initializeForm(): void {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  updateSerialNumbers(): void {
    this.serialNumbers = Array(this.admins.length)
      .fill(0)
      .map((x, i) => i + 1);
  }

  loadAdmins(): void { 
    this.adminService.getAdmins().subscribe( 
      (admins) => {
        this.admins = admins.map(admin => {
          return {
            ...admin,
            name: this.capitalizeFirstLetter(admin.name)
          };
        });
        this.updateSerialNumbers();
      },
      (error) => {
        console.error('Error fetching admins:', error); 
      }
    );
  }
  
  
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

 // AdminComponent
onSubmit(): void {
  if (this.adminForm.valid) {
    const name = this.adminForm.value.name; // Check if this retrieves the correct value

    // Make sure you are sending the correct format to the service
    this.adminService.createAdmin({ name }).subscribe(
      (response) => {
        this.initializeForm();
        this.loadAdmins(); 
      },
      (error) => {
        console.error('Error creating admin:', error); 
      }
    );
  }
}


deleteAdmin(adminId: number): void { 
  if (adminId !== undefined) {
    this.adminService.deleteAdmin(adminId).subscribe(
      () => {
        console.log('Admin deleted successfully'); 
        this.loadAdmins(); 
      },
      (error: any) => {
        console.error('Error deleting admin:', error); 
      }
    );
  }
}

  cancelEditing(): void {
    this.isEditing = false;
  }

  editAdmin(admin: any): void { 
    if (this.selectedAdmin && this.selectedAdmin.id !== undefined && this.selectedAdmin.id === admin.id && this.isEditing){
      this.cancelEditing();
    } else {
      this.selectedAdmin = { ...admin }; 
      this.isEditing = true;
    }
  }

  saveEditedAdmin(): void {
    if (this.selectedAdmin) {
      this.adminService.updateAdmin(this.selectedAdmin).subscribe( 
        (response) => {
          this.isEditing = false;
          this.loadAdmins(); 
        },
        (error) => {
          console.error('Error updating admin:', error); 
        }
      );
    }
  }
  
  
  sortAdmins(): void { 
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      this.admins.sort((a, b) => (a.id !== undefined && b.id !== undefined) ? a.id - b.id : 0); 
    } else {
      this.admins.sort((a, b) => (a.id !== undefined && b.id !== undefined) ? b.id - a.id : 0); 
    }
    this.updateSerialNumbers();
  }
}


