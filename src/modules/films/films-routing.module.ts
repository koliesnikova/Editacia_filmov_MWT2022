import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FilmEditComponent } from "src/app/film-edit/film-edit.component";
import { FilmsListComponent } from "./films-list/films-list.component";

const routes: Routes = [
  { path: "", component: FilmsListComponent },
  { path: 'edit/:id', component: FilmEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }