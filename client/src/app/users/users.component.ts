import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user: User = {
    userId: 'testUser',
    login: 'testUserLogin',
    password: 'testUserPassword',
    isAuthenticated: false,
  };

  constructor() { }

  ngOnInit(): void {
  }

}
