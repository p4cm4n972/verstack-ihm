import { Routes } from '@angular/router';
import { HomeComponent } from './core/component/home/home.component';
import { VersionComponent } from './core/component/version/version.component';
import { AboutComponent } from './core/component/about/about.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'version', component: VersionComponent
  },
 /* { path: 'stat', component: StatComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'login', component: LoginComponent },*/
  { path: '', redirectTo: '/home', pathMatch: 'full' },
 // { path: '**', component: PageNotFoundModule }
    
    

];
