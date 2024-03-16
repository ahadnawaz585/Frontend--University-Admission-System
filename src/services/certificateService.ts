import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { certificateData } from 'src/models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class certificateService {
  private baseUrl = 'http://localhost:3000/api/certificate';

  constructor(private http: HttpClient) { }

  getCertificate(): Observable<certificateData[]> {
    return this.http.get<certificateData[]>(`${this.baseUrl}/getCertificate`);
  }

  createCertificate(name: string): Observable<certificateData> {
    const body = { certificateName: name }; // Ensure it matches the backend expectation
    return this.http.post<certificateData>(`${this.baseUrl}/createCertificate`, body);
}

updateCertificate(certificate: certificateData): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/updateCertificate/${certificate.id}`, certificate);
}

  deleteCertificate(certificateId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteCertificate/${certificateId}`);
  }

  clearCertificate(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearCertificate`);
  }
}
