import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ViewComponent } from './view/view.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { MailComponent } from './mail/mail.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'view', component: ViewComponent},
  { path: 'analysis', component: AnalysisComponent},
  {path: 'mail', component: MailComponent}
];
