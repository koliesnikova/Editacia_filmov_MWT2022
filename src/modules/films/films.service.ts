import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { FilmsResponse } from 'src/entities/films-response';
import { UsersService } from 'src/services/users.service';
import { environment } from '../../environments/environment';
import { SnackbarService } from 'src/services/snackbar.service';
import { Film } from 'src/entities/film';

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  url = environment.restServer + 'films/';

  constructor(private http: HttpClient, private usersService: UsersService, private messageService: SnackbarService) { }

  get token(): string | null {
    return this.usersService.token;
  }

  public deleteFilm(filmId: number): Observable<void> {
    return this.http.delete<void>(this.url + 'films/' + filmId + '/' + this.token).pipe(
      tap(() => {
        this.messageService.successMessage("Film úspešne vymazaný");
      })

    );
  }

  public saveFilm(film: Film): Observable<Film> {
    return this.http.post<Film>(this.url + "films/" + this.token, film).pipe(
      map(jsonFilm => Film.clone(jsonFilm)),
      tap(film => this.messageService
        .successMessage("Používateľ " + film.nazov + " úspešne uložený"))
    );
  }

  public getFilmById(id: number): Observable<Film> {
    return this.http.get<Film>(this.url + 'films/' + id + '/' + this.token).pipe(
      map(jsonFilm => Film.clone(jsonFilm))
    );
  }


  processHttpError(error: any): any {
    throw new Error('Method not implemented.');
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
}
