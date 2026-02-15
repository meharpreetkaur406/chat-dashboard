import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../services/signalr.service';
import { MatDialog, MatDialogModule  } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ComposeMessageComponent } from './compose-message.component';
import { ChangeDetectorRef } from '@angular/core';
// Individual Chat Component

@Component({
  selector: 'app-chats',
  imports: [
    CommonModule,
    FormsModule, 
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {

  currentUser = 'user_002'; // temporary hardcoded

  newMessage = '';

  chats: any[] = [];
  selectedChat: any = null;
  sentChats: any[] = [];
  receivedChats: any[] = [];

  selectedTab: 'all' | 'received' | 'sent' = 'all';
  filteredChats: any[] = [];

  constructor(
    private http: HttpClient,
    private signalrService: SignalrService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.signalrService.startConnection();
    this.loadChats();
    this.applyFilter();

    this.signalrService.onReceiveMessage((message) => {

      console.log("New message received: ", message);

      // find existing conversation
      const chat = this.chats.find(c => c.name === message.senderId);

      if (!chat) return;

      const newMsg = {
        sender: message.senderId,
        text: message.messageBody,
        createdAt: message.createdAt
      };

      // update messages (new reference → UI refresh)
      chat.messages = [...chat.messages, newMsg];
      chat.lastMessage = message.messageBody;

      // move chat to top
      this.chats = [chat, ...this.chats.filter(c => c !== chat)];

      // refresh tabs + UI
      this.sentChats = this.chats.filter(c => 
        c.messages[c.messages.length - 1].sender === this.currentUser
      );

      this.receivedChats = this.chats.filter(c => 
        c.messages[c.messages.length - 1].sender !== this.currentUser
      );

      this.applyFilter();
    });
  }

  loadChats() {
    this.http.get<any>('http://localhost:5144/api/messages/user_002').subscribe(res => {
      // res is the API response dictionary
      console.log("res: ", res)
      this.chats = Object.keys(res).map(key => {
        const messages = res[key].map((m: any) => ({
          sender: m.senderId,
          text: m.messageBody,
          createdAt: m.createdAt
        }));


        // Determine the other participant (not current user)
        const ids = key.split('/');
        console.log(
         ids
        )
        const otherUserId = ids[0] === this.currentUser ? ids[1] : ids[0];

        return {
          name: otherUserId, // replace with actual username if available
          messages,
          lastMessage: messages.length > 0 ? messages[messages.length - 1].text : ''
        };
      });

      // Optional: sort chats by last message time descending
      this.chats.sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1]?.createdAt;
        const lastB = b.messages[b.messages.length - 1]?.createdAt;
        return new Date(lastB).getTime() - new Date(lastA).getTime();
      });

      console.log("this.chats: ", this.chats);

      this.sentChats = this.chats.filter(chat => {
        const lastMsg = chat.messages[chat.messages.length - 1];
        return lastMsg.sender === this.currentUser;
      });

      console.log(
        "sentChats: ", this.sentChats
      );

      

      this.receivedChats = this.chats.filter(chat => {
        const lastMsg = chat.messages[chat.messages.length - 1];
        return lastMsg.sender !== this.currentUser;
      });

      console.log(
        "receivedChats: ", this.receivedChats
      );

      this.changeTab('all')
    });
  }

  changeTab(tab: 'all' | 'received' | 'sent') {
    this.selectedTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    console.log("apply filter function called")
    console.log("chats", this.chats);
    console.log("selectedChat: ", this.selectedChat)
    if (this.selectedTab === 'all') {
      console.log("all tab is selcted")
      this.filteredChats = this.chats;
    } 
    else if (this.selectedTab === 'received') {
      this.filteredChats = this.receivedChats;
    } 
    else {
      this.filteredChats = this.sentChats;
    }
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
  }

  trackByChat(index: number, chat: any) {
    return chat.name; // or chat.id if you have one
  }

  trackByMessage(index: number, message: any) {
    return message.createdAt; // or a unique message id if you have one
  }

  sendMessage() {
  if (!this.newMessage.trim() || !this.selectedChat) return;

  const receiverId = this.selectedChat.name;

  const payload = {
    SenderId: this.currentUser,
    ReceiverId: receiverId,
    MessageBody: this.newMessage
  };

  const messageText = this.newMessage;

  this.http.post('http://localhost:5144/api/messages/send', payload)
    .subscribe(() => {

      const newMsg = {
        sender: this.currentUser,
        text: messageText,
        createdAt: new Date()
      };

      // 1️⃣ Replace selectedChat with new object
      this.selectedChat = {
        ...this.selectedChat,
        messages: [...this.selectedChat.messages, newMsg],
        lastMessage: messageText
      };

      // 2️⃣ Update chats array (move to top)
      this.chats = [
        this.selectedChat,
        ...this.chats.filter(c => c.name !== this.selectedChat.name)
      ];

      // 3️⃣ Update filteredChats based on tab
      switch (this.selectedTab) {
        case 'all':
          this.filteredChats = [...this.chats];
          break;
        case 'sent':
          this.filteredChats = [...this.sentChats.filter(c => c.messages[c.messages.length-1].sender === this.currentUser)];
          break;
        case 'received':
          this.filteredChats = [...this.receivedChats.filter(c => c.messages[c.messages.length-1].sender !== this.currentUser)];
          break;
      }

      // 4️⃣ Clear input
      this.newMessage = '';
      this.cdr.detectChanges();
    });
}


  openCompose() {
    this.dialog.open(ComposeMessageComponent, {
      width: '500px',
      autoFocus: false,
      height: '80vh'
    });
  }
}
