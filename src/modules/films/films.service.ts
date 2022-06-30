import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { FilmsResponse } from 'src/entities/films-response';
import { UsersService } from 'src/services/users.service';
import { environment } from '../../environments/environment';
import { SnackbarService } from 'src/services/snackbar.service';
import { Film } from 'src/entities/film';

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  private url = environment.restServer + 'films/';
  //url = 'http://localhost:8080/films';
  constructor(private http: HttpClient, private usersService: UsersService, private messageService: SnackbarService) { }

  get token(): string | null {
    return this.usersService.token;
  }

  public deleteFilm(filmId: number): Observable<void> {
    let httpOptions = this.getHeader();
    return this.http.delete<void>(this.url + filmId, httpOptions).pipe(
      tap(() => {
        this.messageService.successMessage("Film úspešne vymazaný");
      }),
      catchError(error => this.processHttpError(error))

    );
  }



  public saveFilm(film: Film): Observable<Film> {
    let httpOptions = this.getHeader();
    console.log(film)
    return this.http.post<Film>(this.url, film, httpOptions).pipe(
      map(jsonFilm => Film.clone(jsonFilm)),
      tap(film => this.messageService
        .successMessage("Film " + film.nazov + " úspešne uložený")),
      catchError(error => this.processHttpError(error))
    );
  }

  public getFilmById(id: number): Observable<Film> {
    let httpOptions = this.getHeader();
    return this.http.get<Film>(this.url + id, httpOptions).pipe(
      map(jsonFilm => Film.clone(jsonFilm)),
      catchError(error => this.processHttpError(error))
    );
  }



  getHeader(): {
    headers?: { "X-Auth-Token": string },
    params?: HttpParams
  } | undefined {
    return this.token ? {
      headers: {
        "X-Auth-Token": this.token
      }
    }
      : undefined;
  }



  getFilms(indexFrom?: number,
    indexTo?: number,
    search?: string,
    orderBy?: string,
    descending?: boolean): Observable<FilmsResponse> {
    let httpOptions = this.getHeader();
    if (indexFrom || indexTo || search || orderBy || descending) {
      httpOptions = { ...httpOptions, params: new HttpParams() }
    }
    if (indexFrom && httpOptions?.params) {
      httpOptions.params = httpOptions?.params?.set('indexFrom', indexFrom);
    }
    if (indexTo && httpOptions?.params) {
      httpOptions.params = httpOptions?.params?.set('indexTo', indexTo);
    }
    if (search && httpOptions?.params) {
      httpOptions.params = httpOptions?.params?.set('search', search);
    }
    if (orderBy && httpOptions?.params) {
      httpOptions.params = httpOptions?.params?.set('orderBy', orderBy);
    }
    if (descending && httpOptions?.params) {
      httpOptions.params = httpOptions?.params?.set('descending', descending);
    }
    return this.http.get<FilmsResponse>(this.url, httpOptions).pipe(
      catchError(error => this.usersService.processHttpError(error))
    );
  }

  public processHttpError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.messageService.errorMessage("Server je nedostupný");
      } else {
        if (error.status >= 400 && error.status < 500) {
          const message = error.error.errorMessage || JSON.parse(error.error).errorMessage;
          this.messageService.errorMessage(message);
          console.error("Server error", error);
        } else {
          if (error.status >= 500) {
            this.messageService.errorMessage("Server má problém, kontaktujte administrátora");
            console.error("Server error", error);
          }
        }
      }
    } else {
      this.messageService.errorMessage("Oprav si klienta, programátor");
      console.error("Server error", error);
    }
    return EMPTY;
  }
}
