import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../model/model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  @Input() user: User;
  @Output() toggle: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
