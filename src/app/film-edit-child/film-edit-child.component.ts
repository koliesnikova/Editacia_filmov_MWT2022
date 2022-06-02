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
  @Input() film: any;
  @Output() saved = new EventEmitter<Film>();
  hide = true;
  editForm = new FormGroup({
    filmName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    rok: new FormControl('', [
      // Validators.required,
      //Validators.minLength(4),
      //Validators.maxLength(4),
      //Validators.pattern('\\d+')
    ]),
    afi1998: new FormControl('', [


      // Validators.maxLength(3)
    ]),
    afi2007: new FormControl('', [


      // Validators.maxLength(4)
    ]),

    slovakName: new FormControl('', [
      // Validators.required,
      // Validators.minLength(4)
    ])
  });
  title = '';

  constructor(private filmService: FilmsService) { }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.film) {
  //     this.title = this.film.id ? "Editácia filmu" : "Pridávanie filmu";
  //     console.log(this.film.id)

  //     this.filmName.setValue("anime");
  //     //this.slovakName.setValue(this.slovakName);
  //     //this.rok.setValue(this.rok);
  //     //this.afi1998.setValue(this.afi1998);
  //     //this.afi2007.setValue(this.afi2007);
  //     console.log('Input:', this.film);
  //   }
  // }


  // onSubmit() {
  //   const clovek: Clovek[] = [];
  //   const postava: Postava[] = [];
  //   const poradie: any = {}
  //   const filmToSave = new Film(

  //     this.filmName.value,
  //     this.rok.value,
  //     this.slovakName.value,
  //     this.afi1998.value,
  //     this.afi2007.value,
  //     clovek,
  //     postava,
  //     poradie
  //   );

  //   this.filmService.saveFilm(filmToSave).subscribe(savedFilm => {
  //     this.saved.emit(savedFilm);
  //   });
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.film) {
      this.filmName.setValue(this.film.nazov);
      this.rok.setValue(this.film.rok);
      this.slovakName.setValue(this.film.slovenskyNazov);
      // this.afi1998.setValue(this.afi1998)
      //this.afi2007.setValue(this.afi2007)
      console.log('ZADANY', this.film);
    }
  }

  onSubmit(): void {
    const film: Film = {
      ...this.film,
      nazov: this.filmName.value,
      slovenskyNazov: this.slovakName.value,
      rok: this.rok.value,
      afi1998: this.afi1998,

    };

    this.saved.emit(film);
  }

  get filmName(): FormControl {
    return this.editForm.get('filmName') as FormControl;
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





}
