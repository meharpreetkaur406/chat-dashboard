import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'   // ⭐ THIS LINE FIXES EVERYTHING
})
export class ChatService {
    private apiUrl = 'http://localhost:5144/api';

    constructor(private http: HttpClient) {}
    sendMessage(data: any) {
        return this.http.post(`${this.apiUrl}/messages/send`, data); // interceptor adds JWT
    }
    getAllUsers() {
        return this.http.get<any[]>(`${this.apiUrl}/users`); // interceptor adds JWT
    }
}
