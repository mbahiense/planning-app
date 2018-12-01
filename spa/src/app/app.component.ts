import { Component, OnInit } from '@angular/core';
import { EventSocket } from './model/enums';
import { Task } from './model/model';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter} from '@angular/cdk/drag-drop';
import { SocketService } from './service/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  messageContent: string;
  socket: any;

  todo = [];
  doing = [];
  done = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initSocket();
  }

  private initSocket(): void {
    this.socketService.initSocket();

    this.socket = this.socketService.onTasks()
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.todo = this.tasks.filter(task => task.status === 'todo');
        this.doing = this.tasks.filter(task => task.status === 'doing');
        this.done = this.tasks.filter(task => task.status === 'done');
      });

    this.socketService.onEvent(EventSocket.CONNECT).subscribe( _ => console.log('connected'));
    this.socketService.onEvent(EventSocket.DISCONNECT).subscribe( _ => console.log('disconnected'));
  }

  public updateTask(task: Task): void {
    if (!task) {
      return;
    }

    this.socketService.updateTask(task);
  }

  public getPendentTasks(): number {
    return this.tasks.filter(e => e.status === 'todo' || e.status === 'doing').length;
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      console.log('moved', event.currentIndex, event.container.id, ...event.container.data );
      const item = event.container.data[event.currentIndex];
      const idx = this.tasks.findIndex(e => e.id === item.id);
      if (idx !== undefined) {
        const task = this.tasks[idx];
        task.status = <'todo' | 'doing' | 'done'>event.container.id;
        console.log(task);
        this.updateTask(task);
      }
    }
  }
}
