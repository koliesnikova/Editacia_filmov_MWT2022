import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, CanDeactivateComponent {

  userid = 0;
  user: User = new User('','');
  saved = false;

  constructor(private route: ActivatedRoute, 
              private usersService: UsersService,
              private router: Router) { }

  ngOnInit(): void {
//    this.userid = +this.route.snapshot.params['id'];
//    this.usersService.getUserById(this.userid).subscribe(u => this.user = u);
  this.route.paramMap.pipe(
    map(paramMap => {
      this.userid = +(paramMap.get('id') || -1)
      return this.userid;
    }),
    mergeMap(id => this.usersService.getUserById(id))
  ).subscribe(u => this.user = u);
  }

  userSaved(user: User) {
    this.saved = true;
    this.user = user;
    this.router.navigateByUrl("/extended-users");
  }

  canDeactivate(): boolean | Observable<boolean> {
    console.log("Voláme canDeactivate");
    return this.saved;
  }
}
