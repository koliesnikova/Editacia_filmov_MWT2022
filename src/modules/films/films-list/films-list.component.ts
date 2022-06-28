import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, mergeAll, mergeMap, Observable, of, Subject, tap } from 'rxjs';
import { Film } from 'src/entities/film';
import { FilmsResponse } from 'src/entities/films-response';
import { FilmsService } from '../films.service';
import { SnackbarService } from 'src/services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DialogService } from 'src/services/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.css']
})
export class FilmsListComponent implements OnInit, AfterViewInit {
  private url = environment.restServer;
  filmsDataSource: FilmsDataSource;


  columnsToDisplay = ['id', 'nazov', 'rok', 'actions'];
  //filmsDataSource = new MatTableDataSource<Film>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  filter$ = new Subject<string>();


  constructor(private filmsService: FilmsService, private http: HttpClient, private dialogService: DialogService) {
    this.filmsDataSource = new FilmsDataSource(filmsService);
  }

  ngOnInit(): void {
    if (this.filmsService.token) {
      this.columnsToDisplay = ['id', 'nazov', 'slovenskyNazov', 'rok', 'afi1998', 'afi2007', 'actions'];
    }
    this.filmsDataSource = new FilmsDataSource(this.filmsService);

  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.filmsDataSource.addEventObservables(this.paginator, this.sort, this.filter$.asObservable());
    }
  }
  public get token() {
    return localStorage.getItem('token');
  }

  private set token(value: string | null) {
    if (value === null) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', value);
    }
  }

  deleteFilm(film: Film) {

    this.dialogService.confirm("Mazanie filmu", "Naozaj chcete zmazať filma " + film.nazov + "?").subscribe(result => {
      if (result && film.id) {
        this.filmsService.deleteFilm(film.id).subscribe(() => {
          this.filmsDataSource.data = this.filmsDataSource.data.filter(
            (f: Film) => f.id !== film.id,

          )
        });
      }
      window.location.reload();
    })

  }

  filter(event: any) {
    const filterString = event.target.value;
    this.filter$.next(filterString);
  }
}

class FilmsDataSource implements DataSource<Film> {

  futureObservables = new EventEmitter<Observable<any>>();
  paginator: MatPaginator | undefined;
  indexFrom: number = 0;
  indexTo: number = 4;
  filterString: string | undefined;
  sortColumn: string | undefined;
  descending: boolean | undefined;
  data: any;
  addingFilm = false;

  constructor(private filmsService: FilmsService) { }

  addNewFilm(): void {
    this.addingFilm = true;
  }


  goToFirstPage() {
    if (this.paginator) {
      this.indexFrom = 0;
      this.indexTo = this.paginator.pageSize;
      this.paginator.firstPage();
    }
  }

  addEventObservables(paginator: MatPaginator, sort: MatSort, filter$: Observable<string>) {
    this.paginator = paginator;
    this.indexFrom = 0;
    this.indexTo = paginator.pageSize;
    this.futureObservables.emit(of("init request"));
    this.futureObservables.emit(filter$.pipe(
      tap(filterString => {
        this.filterString = filterString.trim().toLowerCase() || undefined;
        this.goToFirstPage();
      })
    ));
    this.futureObservables.emit(paginator.page.pipe(
      tap(pageEvent => {
        this.indexFrom = pageEvent.pageIndex * pageEvent.pageSize;
        this.indexTo = this.indexFrom + pageEvent.pageSize;
        this.indexTo = this.indexTo > pageEvent.length ? pageEvent.length : this.indexTo;
      })
    ));
    this.futureObservables.emit(sort.sortChange.pipe(
      tap(sortEvent => {
        if (sortEvent.direction) {
          this.sortColumn = sortEvent.active;
          this.descending = sortEvent.direction === 'desc';
          if (sortEvent.active === 'afi1998') {
            this.sortColumn = 'poradieVRebricku.AFI 1998';
          }
          if (sortEvent.active === 'afi2007') {
            this.sortColumn = 'poradieVRebricku.AFI 2007';
          }
        } else {
          this.sortColumn = undefined;
          this.descending = undefined;
        }
        this.goToFirstPage();
      })
    ));
  }

  connect(collectionViewer: CollectionViewer): Observable<readonly Film[]> {
    return this.futureObservables.pipe(
      mergeAll(),
      tap(event => console.log("Event to get films from server: ", event)),
      mergeMap(event => this.filmsService.getFilms(this.indexFrom,
        this.indexTo,
        this.filterString,
        this.sortColumn,
        this.descending)),
      map((resp: FilmsResponse) => {
        if (this.paginator)
          this.paginator.length = resp.totalCount;
        return resp.items;
      })
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {

  }
}
