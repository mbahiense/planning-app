import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { EventSocket } from '../model/enums';
import { Task } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private userId; number;
  private socket$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  get socket(): any {
    return this.socket$.getValue();
  }
  constructor() { }

  public initSocket(): void {
    const conOptions = {
      'force new connection': true,
      'reconnectionAttempts': 'Infinity',
      'timeout': 10000,
      'transports': ['websocket']
    };
    this.socket$.next(socketIo(environment.api_url, conOptions));
  }

  public updateTask(task: Task): void {
    this.socket.emit('tasks', task);
  }

  public addNewTask(task: Task): void {
    this.socket.emit('addTasks', task);
    // this.socket.emit('addTasks', { label: 'Somente test', module: 'Common', status: 'todo'});
  }

  public removeTask(task: Task): void {
    this.socket.emit('rmTasks', task);
  }

  public onTasks(): Observable<Task[]> {
    return new Observable<Task[]>(observer => {
      this.socket.on('tasks', (data: Task[]) => observer.next(data));
    });
  }

  public onEvent(event: EventSocket): Observable<any> {
    return new Observable<EventSocket>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public getSocket(): Observable<any> {
    return this.socket$.pipe(skip(1));
  }
}
