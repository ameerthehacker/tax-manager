import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { MessagingService } from "../../services/messaging/messaging.service";

@Component({
  selector: "tm-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  @ViewChild("languageSelector") languageSelector: ElementRef;
  frmSearch: FormGroup;

  constructor(
    public auth: AuthService,
    private router: Router,
    private translateService: TranslateService,
    private messaging: MessagingService
  ) {}

  ngOnInit() {
    const language = localStorage.getItem("language") || "en";
    this.languageSelector.nativeElement.value = language;
    this.frmSearch = new FormGroup({
      query: new FormControl("")
    });
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
  onFrmSearchSubmit() {
    this.messaging.emit("house-search", this.frmSearch.get("query").value);
  }
}
