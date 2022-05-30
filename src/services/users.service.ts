import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, Subscriber, tap } from 'rxjs';
import { Auth } from 'src/entities/auth';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { environment } from 'src/environments/environment';
import { SnackbarService } from './snackbar.service';

export const DEFAULT_REDIRECT_URL = "/extended-users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = environment.restServer;
  private users = [new User("JankoService", "janko@j.sk", 1, new Date("2022-02-24"), 'ahoj'), 
                   new User("MarienkaService", "marka@j.sk"),
                   new User("JežibabaService", "nemá", 13)];
  private loggedUserSubscriber: Subscriber<string | null> | undefined;
  public redirectAfterLogin = DEFAULT_REDIRECT_URL;

  constructor(private http: HttpClient, 
              private messageService: SnackbarService,
              private router: Router) { }

  public get token() {
    return localStorage.getItem('token');
  }

  private set token(value: string | null) {
    if (value === null) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token',value);
    }
  }

  private get username(): string | null {
    return localStorage.getItem('username');
  }

  private set username(value: string | null) {
    if (value === null) {
      localStorage.removeItem('username');
    } else {
      localStorage.setItem('username',value);
    }
  }

  public isLoggedId(): boolean {
    return !!this.token;
  }

  public loggedUser(): Observable<string | null> {
    return new Observable(subscriber => {
      this.loggedUserSubscriber = subscriber;
      this.loggedUserSubscriber.next(this.username);
    });
  }

  public getLocalUsersSynchro(): User[] {
    return this.users;    
  }

  public getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map(jsonArray => jsonArray.map(jsonUser => User.clone(jsonUser))),
      catchError(error => this.processHttpError(error))
    );
  }

  public getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users/' + this.token).pipe(
      map(jsonArray => jsonArray.map(jsonUser => User.clone(jsonUser))),
      catchError(error => this.processHttpError(error))
    );
  }

  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.url + 'user/'+ id + '/' + this.token).pipe(
      map(jsonUser => User.clone(jsonUser)),
      catchError(error => this.processHttpError(error))
    );
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(this.url + 'user/' + userId + '/' + this.token).pipe(
      tap(()=> {
        this.messageService.successMessage("User úspešne vymazaný");
      }),
      catchError(error => this.processHttpError(error))
    );
  }

  public saveUser(user: User): Observable<User> {
    return this.http.post<User>(this.url + "users/" + this.token, user).pipe(
      map(jsonUser => User.clone(jsonUser)),
      tap(user => this.messageService
        .successMessage("Používateľ " + user.name + " úspešne uložený")),
      catchError(error => this.processHttpError(error))
    );
  }

  public registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.url + "register", user).pipe(
      map(jsonUser => User.clone(jsonUser)),
      tap(user => this.messageService
        .successMessage("Úspešne ste sa zaregistrovali, môžete sa prihlásiť")),
      catchError(error => this.processHttpError(error))
    );
  }

  public getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.url + 'groups').pipe(
      map(jsonArray => jsonArray.map(jsonGroup => Group.clone(jsonGroup))),
      catchError(error => this.processHttpError(error))
    );
  }

  public getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(this.url + 'group/' + id).pipe(
      map(jsonGroup => Group.clone(jsonGroup)),
      catchError(error => this.processHttpError(error))
    );
  }

  public login(auth: Auth): Observable<boolean> {
    return this.http.post(this.url + 'login', auth, {responseType : 'text'}).pipe(
      map(token => {
        this.token = token;
        this.username = auth.name;
        this.loggedUserSubscriber?.next(auth.name);
        this.messageService.successMessage("Používateľ " + auth.name + " úspešne prihlásený")
        return true;
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
            this.messageService.errorMessage("Zlý login alebo heslo");
            return of(false);
        }
        return this.processHttpError(error);
      })
    );
  }

  public logout(): void {
    let u = this.username;
    this.token = null;
    this.username = null;
    this.loggedUserSubscriber?.next(null);
    this.http.get(this.url + 'logout/' + this.token).subscribe();
    this.messageService.successMessage("Používateľ " + u + " úspešne odhlásený")
  }

  public userConflicts(user: User): Observable<string[]> {
    return this.http.post<string[]>(this.url + 'user-conflicts', user).pipe(
      catchError(error => this.processHttpError(error))
    );
  }

  public processHttpError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.messageService.errorMessage("Server je nedostupný");
      } else {
        if (error.status >= 400 && error.status < 500 ) {
          const message = error.error.errorMessage || JSON.parse(error.error).errorMessage;
          if (message === 'unknown token') {
            this.messageService.errorMessage("Session expirovaná, nahláste sa znova");
            this.token = null;
            this.username = null;
            this.loggedUserSubscriber?.next(null);
            this.router.navigateByUrl('/login');
          } else {
            this.messageService.errorMessage(message);
          }
        } else {
          if (error.status >= 500) {
            this.messageService.errorMessage("Server má problém, kontaktujte administrátora");
            console.error("Server error",error);
          }
        }
      }
    } else {
      this.messageService.errorMessage("Oprav si klienta, programátor");
      console.error("Server error",error);
    }
    return EMPTY;
  }

}
