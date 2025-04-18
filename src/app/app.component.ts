import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LayoutComponent } from './ui/layout/layout.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./navigation/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatSidenavModule, RouterOutlet, LayoutComponent, HeaderComponent, SidenavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'verstack-ihm';
  @ViewChild('sidenavContent') sidenavContent!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {}

}
