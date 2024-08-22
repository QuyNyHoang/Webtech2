import {Component, HostListener} from '@angular/core';
import {KeyboardNavigation} from "./shared/keyboard-navigation";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    console.log(`Tastendruck erkannt: ${event.key}`); // Debugging-Ausgabe
    KeyboardNavigation.handleTab(event);
    KeyboardNavigation.handleArrowKeys(event);
    KeyboardNavigation.handleEscape(event);
  }

}
