import { Routes } from '@angular/router';
import { isLoggedGuard } from './auth/guards/is-logged.guard';

export const routes: Routes = [
    {
        path:'login',
        loadComponent: () => import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent ),
        
    },

    {
        path:'register',
        loadComponent: () => import('./auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent )
    },

    {
        path:'create-task',
        loadComponent: () => import('./tasks/pages/new-task-page/new-task-page.component').then(m => m.NewTaskPageComponent ),
        canActivate:[ isLoggedGuard ]
    },

    {
        path:'task-list',
        loadComponent: () => import('./tasks/pages/list-task-page/list-task-page.component').then(m => m.ListTaskPageComponent ),
        canActivate:[ isLoggedGuard ]
    },
    
    {
        path:'edit/:id',
        loadComponent: () => import('./tasks/pages/new-task-page/new-task-page.component').then(m => m.NewTaskPageComponent ),
        canActivate:[ isLoggedGuard ]
    },

    {
        path:':id',
        loadComponent: () => import('./tasks/pages/task-page/task-page.component').then(m => m.TaskPageComponent ),
        canActivate:[ isLoggedGuard ]
    },

    {path:'**', redirectTo:'task-list'}
];