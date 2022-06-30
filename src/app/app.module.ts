import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/modules/material.module';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { P404Component } from './p404/p404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GroupsPipe } from '../pipes/groups.pipe';
import { RegisterComponent } from './register/register.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserEditChildComponent } from './user-edit-child/user-edit-child.component';
import { UserAddComponent } from './user-add/user-add.component';
import { GroupsModule } from 'src/modules/groups/groups.module';
import { FilmEditChildComponent } from '../modules/films/film-edit-child/film-edit-child.component';
import { FilmEditComponent } from '../modules/films/film-edit/film-edit.component';
import { FilmAddComponent } from '../modules/films/film-add/film-add.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    P404Component,
    ExtendedUsersComponent,
    NavbarComponent,
    GroupsPipe,
    RegisterComponent,
    ConfirmDialogComponent,
    UserEditComponent,
    UserEditChildComponent,
    UserAddComponent,
    FilmEditChildComponent,
    FilmEditComponent,
    FilmAddComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    GroupsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
