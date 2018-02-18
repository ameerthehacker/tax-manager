import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgFlashMessagesModule } from "ng-flash-messages";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";

// Routes for the app
import { APP_ROUTES } from "./routes/app.route";
import { HomeComponent } from "./components/home/home.component";

import { AuthService } from "./services/auth/auth.service";
import { AuthGuard } from "./guards/auth/auth.guard";
import { NavbarComponent } from './components/navbar/navbar.component';
import { SheetComponent } from './components/sheet/sheet.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, NavbarComponent, SheetComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgFlashMessagesModule.forRoot()
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
