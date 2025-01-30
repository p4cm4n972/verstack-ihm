import { Routes } from '@angular/router';
import { HomeComponent } from './core/component/home/home.component';
import { VersionComponent } from './core/component/version/version.component';
import { AboutComponent } from './core/component/about/about.component';
import { StatComponent } from './core/component/stat/stat.component';
import { ShopComponent } from './core/component/shop/shop.component';
import { NewsComponent } from './core/component/news/news.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { SigninComponent } from './account/signin/signin.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'version',
    component: VersionComponent,
  },
  { path: 'stat', component: StatComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'news', component: NewsComponent },
  { path: 'signin', component: SigninComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },

  /* { path: 'learn', component: LearnComponent },
  { path: 'login', component: LoginComponent },*/
];
