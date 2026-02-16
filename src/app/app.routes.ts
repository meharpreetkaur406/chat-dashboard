import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './components/userAuth/login/login.component';
import { RegisterComponent } from './components/userAuth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatsComponent } from './components/chats/chats.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AccessRequestsComponent } from './components/accessRequests/access-requests.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { 
        path: 'dashboard/:role', 
        component: DashboardComponent, 
        canActivate: [AuthGuard, RoleGuard], 
        children: [ { path: '', redirectTo: 'chats', pathMatch: 'full' }, { path: 'chats', component: ChatsComponent }, { path: 'access-requests', component: AccessRequestsComponent } ] },
];