import { SocketService } from './socket.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../model/model';
import uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  me$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  allUsers$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private sockerService: SocketService) {
    const storeUser = localStorage.getItem('me');
    let user: User;
    if (storeUser) {
      user = JSON.parse(storeUser);
    } else {
      const num = Math.floor(Math.random() * 100);
      console.log('new user', uuid());
      user = {
          id: uuid(),
          avatar: `https://api.adorable.io/avatars/${num}`
      };
    }

    this.me$.next(user);
    this.sockerService.getSocket().subscribe(socket => {
      socket.emit('registerUser', user);
    });
   }

  public onUsers(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      this.sockerService.socket.on('users', (data: User[]) => {
        observer.next(data);
        this.allUsers$.next(data);
      });
    });
  }

  public registerUser(user: User): void {
    localStorage.setItem('me', JSON.stringify(user));
    this.sockerService.socket.emit('registerUser', user);
    this.me$.next(user);
  }

}
