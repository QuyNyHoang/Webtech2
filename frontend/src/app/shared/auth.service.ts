// Datei bindet wir das Backend an
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'; // nutzen Subject für das Einlogg Icon
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = 'http://localhost:3000';
  user: User = {username: '', password: '', email: '', role: ''};
  userChange: Subject<User> = new Subject<User>();
  loggedIn = false;
  loggedInChange: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.loggedInChange.subscribe((value) => {
      this.loggedIn = value
    });
    this.userChange.subscribe((value) => {
      this.user = value
    });
    // gehört zum subject, um zu erkennen, ob userin eingelogged ist oder nicht
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl + '/users');
  }

  getOneUser(username: string): Observable<User>{
    return this.http.get<User>(this.baseUrl + '/users/' + username);
  }

  // Registrierung
  registerUser(user:User): Observable<any> {
    return this.http.post(this.baseUrl + '/users/register', user);
  }

  loginUser(username: string, password: string ): Observable<any>{
    return this.http.post(this.baseUrl + '/users/login/', { username: username, password: password }, {observe: 'response'});
  }
  // noch die Option observe: 'response' hinzugefügt wurde, um die gesamte Response zu erhalten und nicht nur den body als json
  // können dadurch den Status der Response auswerten

  isLoggedin(): boolean {
    return this.loggedIn;
  }

  login(user: User): void {
    this.loggedIn = true
    this.loggedInChange.next(this.loggedIn);
    this.user = user;
    this.userChange.next(this.user);
    console.log('login() : ', this.user);
  }

  logout(): void {
    this.loggedIn = false;
    this.loggedInChange.next(this.loggedIn);
    this.user = {username: '', password: '', email: '', role: ''};
    this.userChange.next(this.user);
  }

  isAdmin(): boolean {
    if(this.user?.role === 'admin')
    {
      return true;
    }
    return false;
  }

  isUser(): boolean {
    if(this.user?.role === 'user')
    {
      return true;
    }
    return false;
  }
}
