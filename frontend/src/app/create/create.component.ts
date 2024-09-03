import {Component, HostListener} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Todo } from '../shared/todo';
import { BackendService } from '../shared/backend.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {KeyboardNavigation} from "../shared/keyboard-navigation";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  todos!: Todo[];
  form!: FormGroup;

  constructor(private bs: BackendService, private router: Router,private location: Location) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      aufgabeControl: new FormControl(''),
      beschreibungControl: new FormControl(''),
      fristControl: new FormControl(''),
    });


  }
  // ngOnInit() wird aufgerufen, wenn die Komponente initialisert wird
  // hier wird ein FormGroup-Objekt erstellt, das die Formularsteuerelemente definiert (Initialisiert mit Standardwert '')
  // this.form wird dann in der create()-Fkt. verwendet


  create(): void {

    const values = this.form.value; // Werte der Formularsteuerelemente aus FormGroup-Objekt gerufen & in values gespeichert
    const todo: Todo = {
      aufgabe: values.aufgabeControl!,
      beschreibung: values.beschreibungControl!,
      frist: values.fristControl!,
      _id: '',
      erledigt: values.erledigtControl!
    }; // Verwendung der Werte um neues Todo-Objekt zuerstellen, das an die backendService.create übergeben wird

    // Hier habe ich eine Funktion hinzugefügt, die überprüft, ob mindestens 1 Eingabefeld ausgefüllt ist, sonst würde man eine leere ToDo speichern
    if (!todo.aufgabe && !todo.beschreibung && !todo.frist) {
      alert('Bitte füllen Sie mindestens ein Feld aus, um eine neue ToDo hinzuzufügen.');
      return;
    }

    this.bs.create(todo)
      .subscribe({
        next: (response) => {
          console.log(response);
          console.log(response._id);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => console.log('createOne() completed')
      });
    this.router.navigateByUrl('/mytasklist');
  }
  // Z.47:create()-Fkt. gibt Observable Objekt zurück
  // Z.48: Observable abonnieren
  // next, error, complete sind Callback-Funktionen
  // Z.49: next wird aufgerufen, wenn die BackendService Methode erfolgreich ist
  // Z.56: complete-Fkt. wird aufgerufen, wenn das Observable vollständig ist (d.h. Datentrom abgeschlossen & liefert keine weiteren Werte)
  // Z.50: kehrt zu mytasklist zurück

  // -------------- Zusatz --------------
  // Callback-Funktionen: Funktionen, die wir einer anderen Funktion als Parameter übergeben, um sie später aufzurufen.
  // Das bedeutet, dass die andere Funktion die Kontrolle an unsere Callback-Funktion übergibt, sobald ein bestimmtes Ereignis eintritt, und wir können dann unsere eigene Logik ausführen, basierend auf dem Ereignis, das eingetreten ist.
  // Callback-Funktionen werden oft in asynchronen Operationen verwendet, bei denen wir auf eine Antwort warten müssen, bevor wir mit der nächsten Aktion fortfahren können.

  cancel(): void {
    this.location.back();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Schließe das Dialogfenster oder navigiere zurück zur ToDo-Liste
      this.cancel(); // Oder eine Methode zum Schließen des Dialogs
    }
  }
}
