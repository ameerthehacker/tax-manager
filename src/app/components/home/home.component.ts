import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "tm-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  sheets: Array<Object> = [];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.get("sheets").then(result => {
      if (!result.err) {
        this.sheets = result.sheets;
      }
    });
  }
}
