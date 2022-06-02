import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { SelectingPreloadingService } from 'src/services/selecting-preloading.service';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { RegisterComponent } from './register/register.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'groups',
    loadChildren: () => import('../modules/groups/groups.module').then(
      mod => mod.GroupsModule
    ),
    canLoad: [AuthGuard]
  },
  {
    path: 'films',
    loadChildren: () => import('../modules/films/films.module').then(
      mod => mod.FilmsModule
    ),
    data: { preload: false }
  },
  { path: 'users', component: UsersComponent },
  {
    path: 'extended-users', component: ExtendedUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/edit/:id', component: UserEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'users/add', component: UserAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/edit/:id', component: UserEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'register', component: RegisterComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: P404Component }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectingPreloadingService
    })
  ],
  exports: [RouterModule]

})
export class AppRoutingModule { }
