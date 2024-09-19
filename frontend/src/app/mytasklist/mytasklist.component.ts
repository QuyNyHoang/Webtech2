import {Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../shared/backend.service';
import { Todo } from '../shared/todo';
import {KeyboardNavigation} from "../shared/keyboard-navigation";
import {Location} from "@angular/common";

@Component({
  selector: 'app-mytasklist',
  templateUrl: './mytasklist.component.html',
  styleUrls: ['./mytasklist.component.css']
})
export class MytasklistComponent implements OnInit {
  todos!: Todo[];
  deleted = false; // Variable ist dafür da, um anzeigen zu lassen, dass der Datensatz gelöscht wurde

  constructor(private bs: BackendService, private router: Router) { }   // wir binden den BackendService mittels dependency injection in unsere Komponente ein

  ngOnInit(): void {
    this.readAll();
  }
  /* beim Erstellen der Komponente ngOnInit()) wird die Variable todos mit allen Daten aus der Datenbank befüllt */

  readAll(): void {
    this.bs.getAll().subscribe(
          {
            next: (response) => {
                  this.todos = response;
                  console.log(this.todos);
                  return this.todos;
                },
            error: (err) => console.log(err),
            complete: () => console.log('getAll() completed')
          })
  }
  // Z.23: in readAll wird getAll() vom Backendservice aufgerufen (wird aber nur durch subscribe() aufgerufen!)
  // Z. 23-29: subscribe()-Funktion "holt" das Observer-Objekt, welches drei sogenannte callback-Funktionen definiert: next, error und complete
  // nur next erforderlich, da erhalten wir die response (das angefragte Objekt) (verwenden Arrow-Funktion, die hier response heißt)

  delete(id: string): void {
    this.bs.deleteOne(id).subscribe(
      {
        next: (response: any) => {
          console.log('response : ', response);
          if(response.status == 204){
            console.log(response.status);
            this.reload(true); // // bei true wird die Löschnachricht angezeigt
          } else {
            console.log(response.status);
            console.log(response.error);
            this.reload(false); // bei false wird die Tabelle angezeigt
          }
        },
        error: (err) => console.log(err),
        complete: () => console.log('deleteOne() completed')
      });
  }
  // Z.35: delete(id) ruft deleteOne(id) mit subscribe auf
  // darin ist eine Fallunterscheidung der zurückgegeben HTTP-Status
  // Z.38: Typisierung ist any, da die response leer sein kann (wenn der Datensatz leer ist) -> ist sie hier aber nicht, Grund ist in der Backend Service
  // Z.40: in der Response ist auch der HTTP-Status

  reload(deleted: boolean) {
    this.deleted = deleted;
    this.readAll();
    this.router.navigateByUrl('/mytasklist');

    if (deleted) {
      setTimeout(() => {
        KeyboardNavigation.setFocus('back-to-table-button');
      }, 0); // Timeout benötigt, um sicherzustellen, dass das Element existiert, bevor der Fokus gesetzt wird
    } else {
      // Falls wir zur Startseite zurückkehren, setzen wir den Fokus auf ein spezifisches Element auf der Startseite
      setTimeout(() => {
        KeyboardNavigation.setFocus('startseite-button-id');
      }, 0);
    }
  }
  // reload()-Fkt. Tabelle wird neugeladen

  ClickEvent() {
    this.router.navigate(['/todo']);
  }

  // Checkbox-Fkt.
  erledigt(todo: Todo) {
    todo.erledigt = !todo.erledigt;
    this.bs.update(todo._id, todo).subscribe(() => {
      console.log('erledigt wurde aktualisiert'); // dient nur der Kontrolle
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.router.navigate(['/mytasklist']);
    }
  }

  // Z.74: übergeben Todo Objekt, dessen Checkbox angeklickt wird
  // Z.75: todo.erledigt wird durch Negation geändert, also aus true wird false und umgekehrt
  // Z.76: update()-Fkt. von BackendService wird aufgerufen, um Daten an den Server zu senden und die DB zu aktualisieren
}
