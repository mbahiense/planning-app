import { UserService } from './../../service/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../model/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss']
})
export class ActiveUsersComponent implements OnInit, OnDestroy {

  users: User[] = [];
  username: string;
  usersSubs: Subscription;
  hideInput: boolean;
  me: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.usersSubs = this.userService.onUsers().subscribe(users => {
      this.users = users;
    });
    this.userService.me$.subscribe(me => {
      this.me = me;
    });
  }

  updateName(): void {
    const selectUser: User = this.users.find(e => e.id === this.me.id);
    selectUser.name = this.username;
    this.hideInput = !this.hideInput;
    this.me = selectUser;
    this.userService.registerUser(selectUser);
  }

  ngOnDestroy(): void {
    this.usersSubs.unsubscribe();
  }
}
