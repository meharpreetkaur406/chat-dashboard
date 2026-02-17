import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// src/app/models/messages-per-day.dto.ts
export interface MessagesPerDayDto {
  messageDate: string; // or Date
  dayName: string;
  messagesSent: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    constructor(private http: HttpClient) {}

    getMessagesPerDay(): Observable<MessagesPerDayDto[]> {
        // <-- tell HttpClient the response type explicitly
        return this.http.get<MessagesPerDayDto[]>('http://localhost:5144/api/messages/sent-per-day');
    }
}