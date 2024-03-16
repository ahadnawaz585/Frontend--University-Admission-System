// program.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramData } from 'src/models/program.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private baseUrl = 'http://localhost:3000/api/program';

  constructor(private http: HttpClient) { }

  getPrograms(): Observable<ProgramData[]> {
    return this.http.get<ProgramData[]>(`${this.baseUrl}/getProgram`);
  }

  createProgram(programData: ProgramData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createProgram`, programData);
  }

  clearPrograms(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearProgram`);
  }

  deleteProgram(programId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteProgram/${programId}`);
  }
  
  updateProgram(program: ProgramData): Observable<ProgramData> {
    return this.http.put<ProgramData>(`${this.baseUrl}/updateProgram/${program.id}`, program);
  }
}
