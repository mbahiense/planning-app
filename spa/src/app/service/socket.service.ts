import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { EventSocket } from '../model/enums';
import { Task, User } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private userId; number;
  private socket;

  constructor() { }

  public initSocket(): void {
    const conOptions = {
      'force new connection': true,
      'reconnectionAttempts': 'Infinity',
      'timeout': 10000,
      'transports': ['websocket']
    };
    this.socket = socketIo(environment.api_url, conOptions);
  }

  public updateTask(task: Task): void {
    this.socket.emit('tasks', task);
  }

  // public registerUser(user: User): void {
  //   this.socket.emit('users', user);
  // }

  public onTasks(): Observable<Task[]> {
    return new Observable<Task[]>(observer => {
      this.socket.on('tasks', (data: Task[]) => observer.next(data));
    });
  }

  public onUsers(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      this.socket.on('users', (data: User[]) => observer.next(data));
    });
  }

  public onEvent(event: EventSocket): Observable<any> {
    return new Observable<EventSocket>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
