import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Film } from 'src/entities/film';
import { FilmsService } from 'src/modules/films/films.service';

@Component({
  selector: 'app-film-edit-child',
  templateUrl: './film-edit-child.component.html',
  styleUrls: ['./film-edit-child.component.css']
})
export class FilmEditChildComponent implements OnChanges {
  @Input() film: Film | undefined;
  @Output() saved = new EventEmitter<Film>();


  hide = true;
  editForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    slovakName: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    rok: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern('\\d+')
    ]),
    afi1998: new FormControl(''),
    afi2007: new FormControl('')

  });
  title = '';

  constructor(private filmService: FilmsService) { }

  get name(): FormControl {
    return this.editForm.get('name') as FormControl;
  }
  get slovakName(): FormControl {
    return this.editForm.get('slovakName') as FormControl;
  }

  get rok(): FormControl {
    return this.editForm.get('rok') as FormControl;
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
  ngOnChanges(changes: SimpleChanges): void {

    if (this.film) {
      this.title = this.film.id ? "Editácia filmu" : "Pridávanie filmu";
      this.name.setValue((this.film.nazov));
      this.slovakName.setValue(this.film.slovenskyNazov);
      this.rok.setValue(this.film.rok);
      this.afi1998.setValue(
        this.film.poradieVRebricku ? ["AFI 1998"] ? this.film.poradieVRebricku["AFI 1998"]
          : undefined
          : undefined
      );
      this.afi2007.setValue(
        this.film.poradieVRebricku
          ? ["AFI 2007"]
            ? this.film.poradieVRebricku["AFI 2007"]
            : undefined
          : undefined
      );
      console.log('Input:', this.film);
    }
  }

  onSubmit() {
    const filmToSave = new Film(
      this.film?.id || null,
      this.name.value,
      this.slovakName.value,
      this.rok.value,
      this.film?.imdbID || "",
      this.film?.reziser,
      this.film?.postava, {
      "AFI 1998": this.afi1998.value,
      "AFI 2007": this.afi2007.value
    }
    );
    this.filmService.saveFilm(filmToSave).subscribe(savedFilm => {
      this.saved.emit(savedFilm);
    });
  }
}
