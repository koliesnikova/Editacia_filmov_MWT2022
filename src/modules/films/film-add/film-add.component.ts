import { Component, OnInit } from '@angular/core';
import { Film } from 'src/entities/film';
import { Router } from '@angular/router';
@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css']
})
export class FilmAddComponent implements OnInit {

  film = new Film(null, '', '');
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  filmSaved() {
    this.router.navigateByUrl("/films");
  }

}
