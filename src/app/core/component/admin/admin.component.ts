import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LangagesService } from '../../../services/langages.service';
import { UsersService } from '../../../services/users.service';
import { ArticlesService } from '../../../services/articles.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  langages: any[] = [];
  users: any[] = [];
  articles: any[] = [];

  newLangage: any = {};
  newUser: any = {};
  newArticle: any = {};

  constructor(
    private langagesService: LangagesService,
    private usersService: UsersService,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.loadLangages();
    this.loadUsers();
    this.loadArticles();
  }

  loadLangages() {
    this.langagesService.getAllLangages().subscribe(data => this.langages = data);
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe(data => this.users = data);
  }

  loadArticles() {
    this.articlesService.getArticles().subscribe(data => this.articles = data);
  }

  createLangage() {
    if (!this.newLangage.name) return;
    this.langagesService.createLangage(this.newLangage).subscribe(() => {
      this.loadLangages();
      this.newLangage = {};
    });
  }

  deleteLangage(id: string) {
    this.langagesService.deleteLangage(id).subscribe(() => this.loadLangages());
  }

  createUser() {
    if (!this.newUser.email) return;
    this.usersService.createUser(this.newUser).subscribe(() => {
      this.loadUsers();
      this.newUser = {};
    });
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  createArticle() {
    if (!this.newArticle.title) return;
    this.articlesService.createArticle(this.newArticle).subscribe(() => {
      this.loadArticles();
      this.newArticle = {};
    });
  }

  deleteArticle(id: string) {
    this.articlesService.deleteArticle(id).subscribe(() => this.loadArticles());
  }
}
