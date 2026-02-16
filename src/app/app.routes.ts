import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './components/userAuth/login/login.component';
import { RegisterComponent } from './components/userAuth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatsComponent } from './components/chats/chats.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, children: [ { path: '', redirectTo: 'chats', pathMatch: 'full' }, { path: 'chats', component: ChatsComponent } ] }
];
