import { Component, OnInit } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

// Import various language services
import { EN } from "../../locales/en";
import { KA } from "../../locales/ka";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    // Load various language services
    this.translateService.setTranslation("en", EN);
    this.translateService.setTranslation("ka", KA);
    // Get default from localstorage
    const language = localStorage.getItem("language") || "en";
    this.translateService.use(language);
  }
}
