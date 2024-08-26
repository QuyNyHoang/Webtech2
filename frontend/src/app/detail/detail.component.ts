import { Location } from '@angular/common'; /* Service für back()-Fkt. */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../shared/backend.service';
import { Todo } from '../shared/todo';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  id: string = '';
  todo: Todo = {aufgabe: '', beschreibung: '', frist: '', _id: '', erledigt: false}; // Hinzugefügte Zeile zur Initialisierung von `todo`
  form = new FormGroup({
    aufgabeControl : new FormControl<string>(''),
    beschreibungControl: new FormControl<string>(''),
    fristControl: new FormControl<string>(''),
    erledigtControl: new FormControl<boolean>(false) // standardmäßig auf false
});
// form zeigt auf das Formular (bestehend aus FormControl-Elementen, erzeugen diese Elemente in den Z. 16-19 (mit String typisiert)

  constructor(
    private route: ActivatedRoute,
    private bs: BackendService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.readOne(this.id);
  }
  // ngOnInit beim Initialisieren der Komponente wird todo mit passenden Eintrag aus der DB befüllt

  readOne(id: string): void {
      this.bs.getOne(id).subscribe(
      {
        next: (response: Todo) => {
                this.todo = response;
                console.log(this.todo);
                this.form.patchValue({
                  aufgabeControl: this.todo?.aufgabe,
                  beschreibungControl: this.todo?.beschreibung,
                  fristControl: this.todo?.frist,
                  erledigtControl: this.todo?.erledigt
                })
                return this.todo;
        },
        error: (err) => console.log(err),
        complete: () => console.log('getOne() completed')
      });
  }
  // Z.37: Werte von todo werden durch getOne(id)-Fkt. entnommen
  // Z.42-45: Eingabefeldern werden Werte zugewiesen
  // Z.42: patchValue()-Fkt. kann allen oder bestimmten FormControl-Elementen einen Wert zuweisen
  // ?: ist ein safe navigation operator (vermeidet das Zugreifen auf einen Wert, der noch nicht existiert)

 update(): void {
    const values = this.form.value;
    this.todo.aufgabe = values.aufgabeControl!;
    this.todo.beschreibung = values.beschreibungControl!;
    this.todo.frist = values.fristControl!;
    this.todo.erledigt = this.form.value.erledigtControl!;
    this.bs.update(this.id, this.todo)
      .subscribe({
        next: (response) => {
          console.log(response);
          console.log(response._id);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => console.log('update() completed')
      }
      );
    this.router.navigateByUrl('/mytasklist');
  }
  // Z.59-60: zunächst alle Werte des Formulars ausgelesen & in this.todo gespeichert
  // Z.63: dann update()-Fkt. des BackendService aufgerufen und this.id + this.todo übergeben
  // Z.75: am ende wird wieder die mytasklist Komponente aufgerufen -> navigatebyUrl()-Fkt. des Router-Services

  cancel(): void {
    this.router.navigateByUrl('/mytasklist');
  }
}

// ------------------- Zusatz -------------------
// getOne(id) des BackendService gibt Observable zurück, welches die subscribe()-Fkt. nutzen muss
