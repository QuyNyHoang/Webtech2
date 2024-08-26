import {Component, HostListener} from '@angular/core';
import {KeyboardNavigation} from "./shared/keyboard-navigation";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private router: Router) {
    KeyboardNavigation.init(this.router);
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        KeyboardNavigation.initializeFocus();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    console.log(`Tastendruck erkannt: ${event.key}`); // Debugging-Ausgabe
    KeyboardNavigation.handleTab(event);
    KeyboardNavigation.handleArrowKeys(event);
    KeyboardNavigation.handleEscape(event);
    KeyboardNavigation.handleEnter(event);
  }
}
