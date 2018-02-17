import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "tm-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {}

  onBtnLogoutClick(evt) {
    evt.preventDefault();
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}
