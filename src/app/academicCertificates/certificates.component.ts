import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { certificateData } from 'src/models/certificate.model';
import { certificateService } from 'src/services/certificateService';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent {
  certificateForm!: FormGroup;
  certificates: certificateData[] = [];
  deletionSuccess = false;
  selectedCertificate: any | null = null;
  isEditing = false;
  serialNumbers: number[] = [];
  isAscending: boolean = true;
  certificate: any;

  constructor(
    private fb: FormBuilder,
    private certificateService: certificateService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCertificates();
  }

  initializeForm(): void {
    this.certificateForm = this.fb.group({
      name: ['', Validators.required],
    });
  }


  loadCertificates(): void {
    this.certificateService.getCertificate().subscribe(
      (certificates) => {
        this.certificates = certificates.map(certificate => {
          return {
            ...certificate,
            name: this.capitalizeFirstLetter(certificate.certificateName)
          };
        });

        this.certificates.sort((a, b) => a.id - b.id); // Assuming 'id' is the property to sort on

        this.updateSerialNumbers();
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  onSubmit(): void {
    if (this.certificateForm.valid) {
      const name = this.certificateForm.value.name;
      this.certificateService.createCertificate(name).subscribe(
        (response) => {
          // Logic after successful certificate creation
          console.log('Certificate created successfully');
          this.initializeForm();
          this.loadCertificates(); // Assuming you have a method to load certificates
        },
        (error) => {
          console.error('Error creating certificate:', error);
          // Handle error cases here
        }
      );
    }
  }


  deleteCertificate(certificateId: number): void {
    this.certificateService.deleteCertificate(certificateId).subscribe(
      () => {
        console.log('Certificate deleted successfully');
        this.loadCertificates();
      },
      (error: any) => {
        console.error('Error deleting certificate:', error);
      }
    );
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  editCertificate(certificate: any): void {
    if (this.selectedCertificate && this.selectedCertificate.id === certificate.id && this.isEditing) {
      this.cancelEditing();
    } else {
      this.selectedCertificate = { ...certificate };
      this.isEditing = true;
    }
  }


  saveEditedCertificate(): void {
    if (this.selectedCertificate) {
      const editedCertificate = {
        id: this.selectedCertificate.id,
        certificateName: this.selectedCertificate.name 
      };
  
      this.certificateService.updateCertificate(editedCertificate).subscribe(
        (response) => {
          console.log('Certificate updated successfully');
          this.isEditing = false;
          this.loadCertificates();
        },
        (error) => {
          console.error('Error updating certificate:', error);
        }
      );
    }
  }
  

  sortCertificates(): void {
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      this.certificates.sort((a, b) => a.id - b.id);
    } else {
      this.certificates.sort((a, b) => b.id - a.id);
    }
    this.updateSerialNumbers();
  }

  updateSerialNumbers(): void {
    this.serialNumbers = Array(this.certificates.length)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
