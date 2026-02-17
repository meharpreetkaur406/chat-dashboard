import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message-compose',
  standalone: true,
  imports : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './compose-message.component.html'
})
export class ComposeMessageComponent implements OnInit {

  userCtrl = new FormControl('');
  allUsers: any[] = [];
  selectedUsers: any[] = [];
  filteredUsers!: Observable<any[]>;

  messageText = '';
  senderId !: string;
//   console.log("sendeRid", senderId);
//   receiverIds: this.selectedUsers.map(u => u._id);

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) autocomplete!: MatAutocompleteTrigger;
   ngOnInit() {
    this.senderId = this.authService.userName;
    this.chatService.getAllUsers().subscribe(res => {
      this.allUsers = res

      this.filteredUsers = this.userCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.allUsers.filter(user =>
        user.username?.toLowerCase().includes(filterValue) &&
        !this.selectedUsers.some(u => u._id === user._id)
    );
    }

  selected(event: any): void {
    this.selectedUsers.push(event.option.value);
    this.userCtrl.setValue('');
  }

  remove(user: any): void {
    this.selectedUsers = this.selectedUsers.filter(u => u._id !== user._id);
  }

  async sendMessage() {
    const payload = {
      SenderId: this.senderId,
      ReceiverIds: this.selectedUsers.map(u => u.username),
      MessageBody: this.messageText,
      CreatedAt: new Date().toISOString()
    };

    this.chatService.sendMessage(payload).subscribe(() => {
      this.messageText = '';
      this.selectedUsers = [];
      this.cdr.detectChanges();
    });
  }

  openUserList() {
    if (this.autocomplete) {
        // delay ensures the panel is initialized
        setTimeout(() => {
        this.autocomplete.openPanel();
        }, 0);
    }
   }
}