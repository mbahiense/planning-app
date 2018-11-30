import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { EventSocket } from '../model/enums';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private socket;

  constructor() { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public updateTask(task: any): void {
    this.socket.emit('tasks', task);
  }

  public onTasks(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('tasks', (data: any) => observer.next(data));
    });
  }

  public onEvent(event: EventSocket): Observable<any> {
    return new Observable<EventSocket>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
