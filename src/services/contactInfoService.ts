import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { contactInfoData } from 'src/models/contactInfo.model';

@Injectable({
  providedIn: 'root'
})
export class contactInformationService {
  private baseUrl = 'http://localhost:3000/api/studentInformation';

  constructor(private http: HttpClient) { }

  getStudentInformation(): Observable<contactInfoData[]> {
    return this.http.get<contactInfoData[]>(`${this.baseUrl}/getStudentInformation`);
  }

  createStudentInformation(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createStudentInformation`, info);
  }

  updateStudentInformation(info: contactInfoData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateStudentInformation/${info.id}`, info);
  }

  deleteStudentInformation(infoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteStudentInformation/${infoId}`);
  }

  deleteSingleStudentInformation(infoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteStudentInformation/${infoId}`);
  }
}
