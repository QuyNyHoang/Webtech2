import {NavigationEnd, Router} from '@angular/router';
import {Component, ElementRef, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {filter, Observable} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
  isLoggedIn = false;
  username: String = '';
  skipLinkHref = '#'; // Standardmäßig auf ein generisches ID
  @ViewChild('') homeContent!: ElementRef;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.loggedInChange.subscribe( value => {
      this.isLoggedIn = value
      if(this.isLoggedIn) {
        this.auth.userChange.subscribe( val => {
          console.log('nav user', val)
          this.username = val?.username;
          console.log('nav username', this.username)
        })
      }
    });
  }

  ngOnInit(){
    // Router-Ereignisse abonnieren, um auf NavigationEnd zu reagieren
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Typüberprüfung
      )
      .subscribe((event: NavigationEnd) => {
        this.updateSkipLink(event.urlAfterRedirects); // Skip-Link aktualisieren
      });
  }

  callLogin() {
    this.router.navigate(['/login'])
  }

  callLogout() {
    this.isLoggedIn = false;
    this.auth.logout();
    this.router.navigate(['/login'])
  }

  updateSkipLink(url: string): void {
    // Setze den Skip-Link basierend auf der aktuellen Route
    if (url.includes('register')) {
      this.skipLinkHref = '#register-content';
    } else if (url.includes('login')) {
      this.skipLinkHref = '#login-content';
    } else if (url.includes('mytasklist')) {
      this.skipLinkHref = '#mytasklist-content';
    } else if (url.includes('userlist')) {
      this.skipLinkHref = '#userlist-content';
    } else {
      this.skipLinkHref = '#'; // Standardmäßig auf Startseite
    }
    console.log('Skip link updated to:', this.skipLinkHref); // Debug-Ausgabe
  }

  skipToContent() {
    if (this.homeContent) {
      this.homeContent.nativeElement.focus();
    }
  }
}
