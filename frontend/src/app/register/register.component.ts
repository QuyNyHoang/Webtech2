import { ConfirmComponent } from './confirm/confirm.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';

export interface DialogData {
  headline: string;
  info: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', Validators.required)
  });
  roles = [ "admin", "user"];
  hide = true;
  hide2 = true;
  user!: User;

  constructor(private auth: AuthService, public dialog: MatDialog) {}

  onSubmit(): void {
    const values = this.registerForm.value;

    // Fehlermeldung, wenn nicht alle Felder ausgefüllt sind
    if (!values.username || !values.password || !values.password2 || !values.email || !values.role) {
      this.openDialog({ headline: "Fehler", info: "Bitte füllen Sie alle Felder aus" });
      return;
    }

    this.user = {
      username: values.username!,
      password: values.password!,
      email: values.email!,
      role: values.role!
    };
    console.log(this.user)
    this.auth.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('response', response)
        this.user = response;
        this.auth.login(this.user) // rufen die login()-Fkt. des Services auf
        this.openDialog({ headline: "Erfolg", info: "Nutzerin " + response.username + " registriert!" });
      },
      error: (err) => {
        console.log('error', err.error.error)
        this.openDialog({ headline: "Fehler", info: "Nutzername und/oder E-Mail existiert bereits" });
      },
      complete: () => console.log('register completed')
    });
  }
  // next, error etc. sind vom Observer
  // Z.49: wird aufgerufen, wenn username oder email bereits existieren

    openDialog(data: DialogData) {
      this.dialog.open(ConfirmComponent, { data });
  }

}
