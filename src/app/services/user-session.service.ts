import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

/*
What this does:

1. Stores the user

2. Allows other components to access it

3. Works like a shared memory 
*/

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  clearUser() {
    this.currentUserSubject.next(null);
  }
}
