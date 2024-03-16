import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { paymentData } from 'src/models/payment.model';

@Injectable({
    providedIn: 'root'
})
export class paymentService {
    private baseUrl = 'http://localhost:3000/api/applicationPayment';

    constructor(private http: HttpClient) { }

    getPayment(): Observable<paymentData[]> {
        return this.http.get<paymentData[]>(`${this.baseUrl}/getPayment`);
    }

    createPayment(paymentData: paymentData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/createPayment`, paymentData);
    }

    clearPayment(): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/clearPayment`);
    }

    deletePayment(paymentId: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/deletePayment/${paymentId}`);
    }

    updatePayment(payment: paymentData): Observable<paymentData> {
        return this.http.put<paymentData>(`${this.baseUrl}/updatePayment/${payment.id}`, payment);
    }
}
