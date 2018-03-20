import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth/auth.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "tm-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  @ViewChild("languageSelector") languageSelector: ElementRef;

  constructor(
    public auth: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    const language = localStorage.getItem("language") || "en";
    this.languageSelector.nativeElement.value = language;
  }

  onBtnLogoutClick(evt) {
    evt.preventDefault();
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
  onLanguageChange(evt) {
    const language = evt.target.value;
    localStorage.setItem("language", language);
    this.translateService.use(language);
  }
}
