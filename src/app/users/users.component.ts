import { Component, OnInit } from '@angular/core';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users = [new User("Janko", "janko@j.sk", 1, new Date("2022-02-24"), 'ahoj'), 
           new User("Marienka", "marka@j.sk"),
           new User("Ježibaba", "nemá", 13)];
  selectedUser: User | undefined = undefined;
  columnsToDisplay= ['id','name','email'];

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
//    this.users = this.usersService.getLocalUsersSynchro();
    this.usersService.getUsers().subscribe(u => {
      console.log('users from server:', u);
      this.users = u;
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
