import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Clovek } from 'src/entities/clovek';
import { Film } from 'src/entities/film';
import { Postava } from 'src/entities/postava';
import { FilmsService } from 'src/modules/films/films.service';

@Component({
  selector: 'app-film-edit-child',
  templateUrl: './film-edit-child.component.html',
  styleUrls: ['./film-edit-child.component.css']
})
export class FilmEditChildComponent implements OnChanges {
  @Input() film: Film | undefined;
  @Output() saved = new EventEmitter<Film>();
  editForm = new FormGroup({
    filmName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    Rok: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern('\\d+')
    ]),
    afi1998: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern('\\d+')
    ]),
    afi2007: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern('\\d+')
    ]),

    slovakName: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });
  title = '';

  constructor(private filmService: FilmsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.film) {
      this.title = this.film.id ? "Editácia používateľa" : "Pridávanie používateľa";
      this.filmName.setValue(this.film.nazov);
      this.slovakName.setValue(this.slovakName);
      this.Rok.setValue(this.Rok);
      this.afi1998.setValue(this.afi1998);
      this.afi2007.setValue(this.afi2007);

    }
  }


  onSubmit() {
    const clovek: Clovek[] = [];
    const postava: Postava[] = [];
    const poradie: any = {}
    const filmToSave = new Film(

      this.filmName.value,
      this.Rok.value,
      this.slovakName.value,
      this.afi1998.value,
      this.afi2007.value,
      clovek,
      postava,
      poradie
    );
    this.filmService.saveFilm(filmToSave).subscribe(savedFilm => {
      this.saved.emit(savedFilm);
    });
  }

  get filmName(): FormControl {
    return this.editForm.get('name') as FormControl;
  }
  get slovakName(): FormControl {
    return this.editForm.get('slovakName') as FormControl;
  }

  get Rok(): FormControl {
    return this.editForm.get('Rok') as FormControl;
  }

  get afi1998(): FormControl {
    return this.editForm.get('afi1998') as FormControl;
  }

  get afi2007(): FormControl {
    return this.editForm.get('afi2007') as FormControl;
  }

  stringify(error: any): string {
    return JSON.stringify(error);
  }





}
