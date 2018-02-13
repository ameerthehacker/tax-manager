import { Routes } from "@angular/router";

import { LoginComponent } from "../components/login/login.component";
import { HomeComponent } from "../components/home/home.component";

export const APP_ROUTES: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent }
];
