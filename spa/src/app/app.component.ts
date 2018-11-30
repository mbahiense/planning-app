import { Component, OnInit } from '@angular/core';
import { TaskService } from './service/task.service';
import { EventSocket } from './model/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks: any[] = [];
  messageContent: string;
  socket: any;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.initSocket();
  }

  private initSocket(): void {
    this.taskService.initSocket();

    this.socket = this.taskService.onTasks()
      .subscribe((tasks: any) => {
        this.tasks = tasks;
        console.log('receive', tasks);
      });

    this.taskService.onEvent(EventSocket.CONNECT).subscribe( _ => console.log('connected'));
    this.taskService.onEvent(EventSocket.DISCONNECT).subscribe( _ => console.log('disconnected'));
  }

  public updateTask(task: any): void {
    if (!task) {
      return;
    }

    this.taskService.updateTask(task);
  }

  public changeStatus(index: number): void {
     const task = this.tasks[index];
     switch (task.status) {
       case 'todo':
        task.status = 'doing';
        break;
       case 'doing':
        task.status = 'done';
        break;
       case 'done':
       default:
        task.status = 'todo';
        break;
     }
     this.updateTask(task);
  }

  public getPendentTasks(): number {
    return this.tasks.filter(e => e.status === 'todo' || e.status === 'doing').length;
  }
}
