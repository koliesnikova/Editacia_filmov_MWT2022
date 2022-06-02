import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';

import { FilmsService } from 'src/modules/films/films.service';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css']
})
export class FilmEditComponent implements OnInit, CanDeactivateComponent {

  filmId = 0;
  film: Film = new Film(1, '', '', 4, '', [], [], {});
  saved = false;

  constructor(private route: ActivatedRoute,
    private filmService: FilmsService,
    private router: Router) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      map(paramMap => {
        this.filmId = +(paramMap.get('id') || -1)
        return this.filmId;
      }),
      mergeMap(id => this.filmService.getFilmById(id))
    ).subscribe(f => this.film = f);
  }

  filmSaved(film: Film) {
    this.saved = true;
    this.film = film;
    this.router.navigateByUrl("/films");
  }

  canDeactivate(): boolean | Observable<boolean> {
    console.log("Voláme canDeactivate");
    return this.saved;
  }

}
