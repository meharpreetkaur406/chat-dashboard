import * as signalR from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs' //Using BehaviorSubject lets components subscribe to messages instead of passing callbacks every time.

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;
  private messageSource = new BehaviorSubject<any>(null);
  public messages$ = this.messageSource.asObservable();

  constructor() {}

  // Start the connection with a userId from login
  startConnection(userId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5144/chathub`, {
          accessTokenFactory: () => sessionStorage.getItem('token') || '',
          headers: { 'userId': userId },
          withCredentials: true
        })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.log('Error while starting connection: ' + err));

      this.hubConnection.on("ReceiveMessage", (user, message) => {
        console.log(`${user}: ${message}`);
      });
    
    // Register the message listener
    this.registerOnServerEvents();
  }

  private registerOnServerEvents() {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      // Push received message to observable
      this.messageSource.next({ user, message });
    });
  }

  sendMessage(recieverId: string, user: string, message: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', recieverId, user, message)
        .catch(err => console.error('SignalR sendMessage error:', err));
    } else {
      console.warn('SignalR not connected yet.');
    }
  }
}
