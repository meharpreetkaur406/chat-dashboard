import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessRequestsService } from '../../services/access-requests.service';

@Component({
  selector: 'app-access-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './access-requests.component.html'
})
export class AccessRequestsComponent {
    users:any[] = [];

    constructor(
      public accessRequestsService: AccessRequestsService
    ) {}

    ngOnInit(){
        this.loadUsers();
    }

    loadUsers(){
        this.accessRequestsService.getPendingUsers().subscribe((res:any)=>{
            this.users = res.docs;
        });
    }

    approve(user:any, role:string){
        this.accessRequestsService.approveUser(user._id, role).subscribe(()=>{
            this.loadUsers();
        });
    }
}