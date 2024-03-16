import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { applicationHistoryData } from 'src/models/applicationHistory.model';

@Injectable({
    providedIn: 'root'
})
export class appplicationHistoryService {
    private baseUrl = 'http://localhost:3000/api/applicationStatus';

    constructor(private http: HttpClient) { }

    getApplicationHistory(): Observable<applicationHistoryData[]> {
        return this.http.get<applicationHistoryData[]>(`${this.baseUrl}/getStatusHistory`);
    }

    createApplicationHistory(HistoryData: applicationHistoryData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/createStatusHistory`, HistoryData);
    }

    clearApplicationHistory(): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/clearStatusHistory`);
    }

    deleteApplicationHistory(applicationHistoryId: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/deleteStatusHistory/${applicationHistoryId}`);
    }

    updateApplicationHistory(applicationHistory: applicationHistoryData): Observable<applicationHistoryData> {
        return this.http.put<applicationHistoryData>(`${this.baseUrl}/updateStatusHistory/${applicationHistory.id}`, applicationHistory );
    }
}