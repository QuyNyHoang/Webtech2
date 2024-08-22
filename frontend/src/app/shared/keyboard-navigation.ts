export class KeyboardNavigation {
  static handleTab(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent default tab behavior
      const focusableElements = Array.from(document.querySelectorAll('input, button, textarea, select, [tabindex]'));
      const focusedElement = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(focusedElement);
      let newIndex = (currentIndex + 1) % focusableElements.length; // Move to the next element, wrap around
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
        // Custom logic for left arrow if needed
        break;
      case 'ArrowRight':
        event.preventDefault();
        // Custom logic for right arrow if needed
        break;
    }

    if (focusableElements[newIndex]) {
      (focusableElements[newIndex] as HTMLElement).focus();
    }
  }


  static handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Custom escape key handling logic
    }
  }

  static setFocus(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      console.log(`Fokus auf ${elementId} gesetzt`); // Debugging-Ausgabe
    } else {
      console.log(`Element mit ID ${elementId} nicht gefunden`); // Debugging-Ausgabe
    }
  }

}
