import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { previousEducationData } from 'src/models/previousEducation.model';

@Injectable({
  providedIn: 'root'
})
export class PreviousEducationService {
  private baseUrl = 'http://localhost:3000/api/previousEducation';

  constructor(private http: HttpClient) { }

  getPreviousEducation(): Observable<previousEducationData[]> {
    return this.http.get<previousEducationData[]>(`${this.baseUrl}/getPreviousEducation`);
  }

  createPreviousEducation(data: previousEducationData): Observable<previousEducationData> {
    return this.http.post<previousEducationData>(`${this.baseUrl}/createPreviousEducation`, data);
  }

  updatePreviousEducation(data: previousEducationData): Observable<previousEducationData> {
    return this.http.put<previousEducationData>(`${this.baseUrl}/updatePreviousEducation/${data.id}`, data);
  }

  deletePreviousEducation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePreviousEducation/${id}`);
  }

  clearPreviousEducation(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearPreviousEducation`);
  }
}
