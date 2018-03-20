import { Component, OnInit, OnDestroy } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";
import { MessagingService } from "./services/messaging/messaging.service";

// Import various language services
import { EN } from "../../locales/en";
import { KA } from "../../locales/ka";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private messaging: MessagingService
  ) {}

  ngOnInit() {
    // Load various language services
    this.translateService.setTranslation("en", EN);
    this.translateService.setTranslation("ka", KA);
    // Get default from localstorage
    const language = localStorage.getItem("language") || "en";
    this.translateService.use(language);
  }
  ngOnDestroy() {
    this.messaging.destroy();
  }
}
