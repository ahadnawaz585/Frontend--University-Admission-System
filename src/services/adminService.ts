import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { adminData } from 'src/models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class adminService {
  private baseUrl = 'http://localhost:3000/api/Admin';

  constructor(private http: HttpClient) { }

  getAdmins(): Observable<adminData[]> {
    return this.http.get<adminData[]>(`${this.baseUrl}/getAdmin`);
  }

  createAdmin(adminData: adminData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createAdmin`, adminData);
  }
  clearAdmins(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearAdmin`);
  }

  deleteAdmin(adminId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteAdmin/${adminId}`);
  }
  updateAdmin(admin: adminData): Observable<adminData> {
    return this.http.put<adminData>(`${this.baseUrl}/updateAdmin/${admin.id}`, admin);
  }

}