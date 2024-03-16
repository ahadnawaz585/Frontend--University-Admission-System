import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationData } from 'src/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private baseUrl = 'http://localhost:3000/api/application'; 

  constructor(private http: HttpClient) { }

  getApplications(): Observable<ApplicationData[]> {
    return this.http.get<ApplicationData[]>(`${this.baseUrl}/getApplication`);
  }

  createApplication(applicationData: ApplicationData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createApplication`, applicationData);
  }

  clearApplications(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteApplication`);
  }

  deleteApplication(applicationId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteApplication/${applicationId}`);
  }

  updateApplication(application: ApplicationData): Observable<ApplicationData> {
    return this.http.put<ApplicationData>(`${this.baseUrl}/updateApplication/${application.id}`, application);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    const updateStatusUrl = `${this.baseUrl}/updateApplicationStatus/${applicationId}`;
    return this.http.put<any>(updateStatusUrl, { status });
  }
  
}
