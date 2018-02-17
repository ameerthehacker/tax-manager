import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "tm-login",
  templateUrl: "./login.component.html",
  styles: []
})
export class LoginComponent implements OnInit {
  frmLogin = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  get username() {
    return this.frmLogin.get("username");
  }
  get password() {
    return this.frmLogin.get("password");
  }
  onFrmLoginSubmit() {
    this.auth
      .login(this.username.value, this.password.value)
      .then((result: any) => {
        if (!result.error) {
          this.router.navigate(["/"]);
        }
      })
      .catch(err => {
        console.error(`Unexpected error occured: ${JSON.stringify(err)}`);
      });
  }
}
