import { UserService } from './../../service/user.service';
import { Observable } from 'rxjs';
import { SocketService } from './../../service/socket.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task, User } from '../../model/model';

@Component({
  selector: 'app-task-options',
  templateUrl: './task-options.component.html',
  styleUrls: ['./task-options.component.css']
})
export class TaskOptionsComponent implements OnInit {

  @Input() task: Task;
  @Output() editEvent: EventEmitter<Task> = new EventEmitter();

  me$: Observable<User>;

  constructor(private socketService: SocketService,
              private userService: UserService) {
    this.me$ = this.userService.me$;
  }

  ngOnInit() {
  }

  assignToMe(): void {
    this.userService.me$.subscribe(me => {
      this.task.assign = me;
      this.socketService.updateTask(this.task);
    });
  }

  removeAssign(): void {
    this.task.assign = undefined;
    this.socketService.updateTask(this.task);
  }

  edit(): void {
    this.editEvent.next(this.task);
  }

  remove(): void {
    this.socketService.removeTask(this.task);
  }
}
