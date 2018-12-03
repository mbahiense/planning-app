import { Task, User } from './../../model/model';
import { UserService } from './../../service/user.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {

  task: Task;
  users: User[] = [];
  isEditionMode: boolean;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }) {
      if (data.task) {
        this.task = data.task;
        this.isEditionMode = true;
      } else {
        this.task = new Task();
        this.task.status = 'todo';
      }
      this.users = this.userService.allUsers$.getValue().filter(entry => entry.name);
    }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.task.label) {
      console.log('save with assign', this.task.assign);
      this.dialogRef.close(this.task);
    }
  }

}
