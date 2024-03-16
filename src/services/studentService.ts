import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { studentData } from 'src/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:3000/api/student';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<studentData[]> {
    return this.http.get<studentData[]>(`${this.baseUrl}/getStudent`);
  }

  createStudent(studentData:studentData): Observable<studentData> {
    
    return this.http.post<studentData>(`${this.baseUrl}/createStudent`, studentData);
  }

  updateStudent(student: studentData): Observable<studentData> {
    return this.http.put<studentData>(`${this.baseUrl}/updateStudent/${student.id}`, student);
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteStudent/${studentId}`);
  }

  clearStudents(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearStudent`);
  }
}
