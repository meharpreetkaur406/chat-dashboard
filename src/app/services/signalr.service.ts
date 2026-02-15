import * as signalR from '@microsoft/signalr';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5144/chathub', {
            withCredentials: true
        })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  onReceiveMessage(callback: (message: any) => void) {
    this.hubConnection.on('ReceiveMessage', (message) => {
      callback(message);
    });
  }
}
