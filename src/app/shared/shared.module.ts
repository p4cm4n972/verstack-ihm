import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsMobileOnlyDirective } from './is-mobile-only.directive';
import { IsDesktopOnlyDirective } from './is-desktop-only.directive';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IsMobileOnlyDirective,
    IsDesktopOnlyDirective

  ],
  exports: [
    IsMobileOnlyDirective,
    IsDesktopOnlyDirective
  ]
})
export class SharedModule { }
