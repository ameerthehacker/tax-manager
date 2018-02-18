import { Routes } from "@angular/router";

import { LoginComponent } from "../components/login/login.component";
import { HomeComponent } from "../components/home/home.component";

import { AuthGuard } from "../guards/auth/auth.guard";

export const APP_ROUTES: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "**", component: HomeComponent, canActivate: [AuthGuard] }
];
