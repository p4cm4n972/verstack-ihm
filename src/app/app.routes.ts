import { Routes } from '@angular/router';
import { HomeComponent } from './core/component/home/home.component';
import { VersionComponent } from './core/component/version/version.component';
import { AboutComponent } from './core/component/about/about.component';
import { StatComponent } from './core/component/stat/stat.component';
import { ShopComponent } from './core/component/shop/shop.component';
import { NewsComponent } from './core/component/news/news.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { SigninComponent } from './account/signin/signin.component';
import { SignupComponent } from './core/component/signup/signup.component';
import { MentionsComponent } from './composant/mentions/mentions.component';
import { ReleaseComponent } from './composant/release/release.component';
import { ProfileComponent } from './account/profile/profile.component';
import { VerifyEmailComponent } from './account/verify-email/verify-email.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';

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
  { path: 'signup', component: SignupComponent },
  { path: 'mentions', component: MentionsComponent },
  { path: 'release', component: ReleaseComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'confirm-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },

  /* { path: 'learn', component: LearnComponent },
  { path: 'login', component: LoginComponent },*/
];
