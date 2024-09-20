import {Router} from "@angular/router";
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class KeyboardNavigation {

  private static router: Router;

  static init(router: Router) {
    KeyboardNavigation.router = router;
  }

  static initializeFocus(): void {
    const focusableElements = Array.from(document.querySelectorAll('input, button, textarea, select, [tabindex]'));
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
      console.log(`Initial focus set to first element: ${focusableElements[0].id || focusableElements[0].tagName}`);
    }
  }

  static handleTab(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent default tab behavior
      const focusableElements = Array.from(document.querySelectorAll('input, button, textarea, select, [tabindex]'));
      const focusedElement = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(focusedElement);
      let newIndex = event.shiftKey
        ? (currentIndex - 1 + focusableElements.length) % focusableElements.length // Move backward if Shift is pressed
        : (currentIndex + 1) % focusableElements.length; // Move forward
      (focusableElements[newIndex] as HTMLElement).focus();
    }
  }

  static handleArrowKeys(event: KeyboardEvent): void {
    const focusableElements = Array.from(document.querySelectorAll('input, button, textarea, select, [tabindex]'));
    const focusedElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElements.indexOf(focusedElement);

    if (currentIndex === -1) return; // Kein fokussiertes Element gefunden

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        // Fokus auf das erste Element in der Navigation setzen
        const navElement = document.querySelector('mat-nav-list a') as HTMLElement;
        if (navElement) {
          navElement.focus();
          console.log('Fokus auf Startseite gesetzt');
        } else {
          console.log('Kein Navigationselement gefunden');
        }
        return;
      case 'ArrowRight':
        event.preventDefault();
        setTimeout(() => {
          const mainElement = document.querySelector('router-outlet + * input, router-outlet + * button, router-outlet + * textarea, router-outlet + * select, router-outlet + * [tabindex]') as HTMLElement;
          if (mainElement) {
            mainElement.focus();
            console.log('Fokus auf Hauptelement gesetzt');
          } else {
            console.log('Kein Hauptkomponentenelement gefunden');
          }
        }, 0);
        return;
    }
    if (focusableElements[newIndex]) {
      (focusableElements[newIndex] as HTMLElement).focus();
    }
  }

  static handleEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const activeElement = document.activeElement as HTMLElement;

      if (activeElement) {
        activeElement.click();
        console.log(`Enter-Taste gedrückt auf: ${activeElement.tagName}, ID: ${activeElement.id}`); // Debugging-Ausgabe
      } else {
        console.log('Kein aktives Element gefunden');
      }
    }
  }

  static setFocus(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      console.log(`Fokus auf ${elementId} gesetzt`);
    } else {
      console.log(`Element mit ID ${elementId} nicht gefunden`);
    }
  }
}
