import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AccessRequestsService {
    constructor(private http: HttpClient) {}

    private apiUrl = 'http://localhost:5144/api';
    getPendingUsers() {
        return this.http.get(`${this.apiUrl}/pending-users`);
    }

    approveUser(id: string, role: string) {
        return this.http.post(`${this.apiUrl}/approve-user/${id}`, { role });
    }
}