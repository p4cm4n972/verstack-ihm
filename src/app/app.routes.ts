import { Routes } from '@angular/router';
import { HomeComponent } from './core/component/home/home.component';
import { VersionComponent } from './core/component/version/version.component';
import { AboutComponent } from './core/component/about/about.component';
import { StatComponent } from './core/component/stat/stat.component';
import { ShopComponent } from './core/component/shop/shop.component';
import { NewsComponent } from './core/component/news/news.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { SignupComponent } from './core/component/signup/signup.component';
import { MentionsComponent } from './composant/mentions/mentions.component';
import { ReleaseComponent } from './composant/release/release.component';
import { ProfileComponent } from './account/profile/profile.component';
import { VerifyEmailComponent } from './account/verify-email/verify-email.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';
import { mobileNotAllowedGuard } from './guards/mobile-not-allowed.guard';
import { MobileNotAllowedComponent } from './core/mobile-not-allowed/mobile-not-allowed.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'about', component: AboutComponent },
  {
    path: 'version',
    component: VersionComponent, canActivate: [mobileNotAllowedGuard]
  },
  { path: 'stat', component: StatComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'shop', component: ShopComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'news', component: NewsComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'mentions', component: MentionsComponent },
  { path: 'release', component: ReleaseComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'confirm-email', component: VerifyEmailComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [mobileNotAllowedGuard] },
  { path: 'mobile-not-allowed', component: MobileNotAllowedComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },

  /* { path: 'learn', component: LearnComponent },
  { path: 'login', component: LoginComponent },*/
];
