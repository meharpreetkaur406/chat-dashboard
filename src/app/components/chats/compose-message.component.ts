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
  senderId = 'user_002';
//   console.log("sendeRid", senderId);
//   receiverIds: this.selectedUsers.map(u => u._id);

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) autocomplete!: MatAutocompleteTrigger;
   ngOnInit() {

    this.chatService.getAllUsers().subscribe(res => {
      this.allUsers = res;
      console.log("allUsers: ", this.allUsers);

      this.filteredUsers = this.userCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );

      console.log("filteredUsers: ", this.filteredUsers);
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

  sendMessage() {
    console.log("senderID, ", this.senderId);
    const payload = {
      SenderId: this.senderId,
      ReceiverIds: this.selectedUsers.map(u => u.username),
      MessageBody: this.messageText
    };

    this.chatService.sendMessage(payload).subscribe(() => {
      this.messageText = '';
      this.selectedUsers = [];
      this.cdr.detectChanges();
    });
  }

  openUserList() {
    console.log("open use rlist function called")
    if (this.autocomplete) {
        // delay ensures the panel is initialized
        setTimeout(() => {
        this.autocomplete.openPanel();
        }, 0);
    }
   }
}