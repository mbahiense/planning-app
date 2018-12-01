import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { User } from '../../model/model';
import { Subscribable, Observable, Subscription } from 'rxjs';

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

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.usersSubs = this.socketService.onUsers().subscribe(users => {
      this.users = users;
    });
  }

  updateName(): void {
    console.log(this.username);
    this.hideInput = true;
  }

  ngOnDestroy(): void {
    this.usersSubs.unsubscribe();
  }
}
