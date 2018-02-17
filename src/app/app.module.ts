import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";

// Routes for the app
import { APP_ROUTES } from "./routes/app.route";
import { HomeComponent } from "./components/home/home.component";

import { AuthService } from "./services/auth/auth.service";

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
