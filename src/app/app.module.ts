import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgFlashMessagesModule } from "ng-flash-messages";
import { TranslateModule } from "@ngx-translate/core";
import { NgxPaginationModule } from "ngx-pagination";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { PrintBillComponent } from "./components/print-bill/print-bill.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SheetComponent } from "./components/sheet/sheet.component";

// Routes for the app
import { APP_ROUTES } from "./routes/app.route";
import { HomeComponent } from "./components/home/home.component";

import { AuthService } from "./services/auth/auth.service";
import { AuthGuard } from "./guards/auth/auth.guard";
import { MessagingService } from "./services/messaging/messaging.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SheetComponent,
    PrintBillComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgFlashMessagesModule.forRoot(),
    TranslateModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [AuthService, AuthGuard, MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule {}
