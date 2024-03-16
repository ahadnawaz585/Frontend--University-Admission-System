import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { priorityData } from 'src/models/priority.model';

@Injectable({
  providedIn: 'root'
})
export class priorityService {
  private baseUrl = 'http://localhost:3000/api/applicationPreference';

  constructor(private http: HttpClient) { }

  getPriorities(): Observable<priorityData[]> {
    return this.http.get<priorityData[]>(`${this.baseUrl}/getPreference`);
  }

  createPriorities(data: priorityData): Observable<priorityData> {
    return this.http.post<priorityData>(`${this.baseUrl}/createPreference`, data);
  }

  updatePriorities(data: priorityData): Observable<priorityData> {
    return this.http.put<priorityData>(`${this.baseUrl}/updatePreference/${data.id}`, data);
  }

  deleteProrities(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePreference/${id}`);
  }

  clearPreviousEducation(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearPrefrence`);
  }

}