import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { DialogService } from 'src/services/dialog.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  columnsToDisplay= ['id','name','email','active', 'lastLogin', 'groups', 'permissions', 'actions'];
  usersDataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  
  constructor(private usersService: UsersService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(u => {
      this.usersDataSource.data = u;
      console.log(u);
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
    }
    this.usersDataSource.filterPredicate = (user: User, filter: string): boolean => {
      if (user.name.toLowerCase().includes(filter)) return true;
      if (user.email.toLowerCase().includes(filter)) return true;
      if (user.groups.some(group => {
        if (group.name.toLowerCase().includes(filter)) return true;
        return group.permissions.some(perm => perm.toLowerCase().includes(filter));
      })) return true;
      return false;
    };
    this.usersDataSource.sortingDataAccessor = (user: User, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'groups':
          return user.groups.map(group => group.name).join(', ');
        case 'permissions':
          return user.groups.flatMap(group => group.permissions).join(', ');
        default:
        return user[sortHeaderId as keyof User]?.toString() || '';
      }
    };
  }

  filter(event: any) {
    this.usersDataSource.filter = event.target.value.toLowerCase();
  }

  deleteUser(user: User) {
    this.dialogService.confirm("Mazanie používateľa", "Naozaj chcete zmazať používateľa " + user.name + "?").subscribe(result => {
      if (result && user.id) {
        this.usersService.deleteUser(user.id).subscribe(() => {
          this.usersDataSource.data = this.usersDataSource.data.filter( 
            u => u.id !== user.id
          )
        });
      }
    })
  }
}
