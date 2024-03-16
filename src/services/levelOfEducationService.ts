import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LevelOfEducationData } from 'src/models/levelOfEducation.model';

@Injectable({
  providedIn: 'root'
})
export class LevelOfEducationService {
  private baseUrl = 'http://localhost:3000/api/levelOfEducation';

  constructor(private http: HttpClient) { }

  getLevelsOfEducation(): Observable<LevelOfEducationData[]> {
    return this.http.get<LevelOfEducationData[]>(`${this.baseUrl}/getLevelsOfEducation`);
  }

  createLevelOfEducation(levelName: string, mandatoryYearsOfEducation: number): Observable<any> {
    const body = { levelName, mandatoryYearsOfEducation };
    return this.http.post<any>(`${this.baseUrl}/createLevelOfEducation`, body);
  }

  updateLevelOfEducation(level: LevelOfEducationData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateLevelOfEducation/${level.id}`, level);
  }

  deleteLevelOfEducation(levelId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteLevelOfEducation/${levelId}`);
  }

  clearLevelsOfEducation(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/clearLevelsOfEducation`);
  }
}
