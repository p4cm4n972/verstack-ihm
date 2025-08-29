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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
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
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  // Data
  langages: any[] = [];
  users: any[] = [];
  articles: any[] = [];

  // Filtered data for search
  filteredUsers: any[] = [];
  filteredLanguages: any[] = [];
  filteredArticles: any[] = [];

  // Form data
  newLangage: any = {};
  newUser: any = {};
  newArticle: any = {};

  // UI State
  activeTab: string = 'dashboard';
  
  // Search terms
  userSearchTerm: string = '';
  languageSearchTerm: string = '';
  articleSearchTerm: string = '';

  // Math reference for template
  Math = Math;

  constructor(
    private langagesService: LangagesService,
    private usersService: UsersService,
    private articlesService: ArticlesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLangages();
    this.loadUsers();
    this.loadArticles();
  }

  // Navigation methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Data loading methods
  loadLangages() {
    this.langagesService.getAllLangages().subscribe(data => {
      this.langages = data;
      this.filteredLanguages = [...data];
    });
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = [...data];
    });
  }

  loadArticles() {
    this.articlesService.getArticles().subscribe(data => {
      this.articles = data;
      this.filteredArticles = [...data];
    });
  }

  // Search and filter methods
  filterUsers() {
    if (!this.userSearchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(user =>
      user.email?.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
      user.pseudo?.toLowerCase().includes(this.userSearchTerm.toLowerCase())
    );
  }

  filterLanguages() {
    if (!this.languageSearchTerm) {
      this.filteredLanguages = [...this.langages];
      return;
    }
    this.filteredLanguages = this.langages.filter(lang =>
      lang.name?.toLowerCase().includes(this.languageSearchTerm.toLowerCase())
    );
  }

  filterArticles() {
    if (!this.articleSearchTerm) {
      this.filteredArticles = [...this.articles];
      return;
    }
    this.filteredArticles = this.articles.filter(article =>
      article.title?.toLowerCase().includes(this.articleSearchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(this.articleSearchTerm.toLowerCase())
    );
  }

  // CRUD methods - Languages
  createLangage() {
    if (!this.newLangage.name) return;
    this.langagesService.createLangage(this.newLangage).subscribe(() => {
      this.loadLangages();
      this.newLangage = {};
      this.showSuccessMessage('Langage ajouté avec succès');
    });
  }

  deleteLangage(id: string) {
    this.langagesService.deleteLangage(id).subscribe(() => {
      this.loadLangages();
      this.showSuccessMessage('Langage supprimé avec succès');
    });
  }

  editLanguage(language: any) {
    // Pour l'instant, on ouvre juste une notification
    // TODO: Implémenter un dialog d'édition
    this.showInfoMessage('Fonction d\'édition en développement');
  }

  confirmDeleteLanguage(language: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le langage "${language.name}" ?`)) {
      this.deleteLangage(language._id);
    }
  }

  openCreateLanguageDialog() {
    // TODO: Implémenter un dialog de création
    this.showInfoMessage('Dialog de création en développement');
  }

  // CRUD methods - Users
  createUser() {
    if (!this.newUser.email) return;
    this.usersService.createUser(this.newUser).subscribe(() => {
      this.loadUsers();
      this.newUser = {};
      this.showSuccessMessage('Utilisateur ajouté avec succès');
    });
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe(() => {
      this.loadUsers();
      this.showSuccessMessage('Utilisateur supprimé avec succès');
    });
  }

  editUser(user: any) {
    // TODO: Implémenter un dialog d'édition
    this.showInfoMessage('Fonction d\'édition en développement');
  }

  confirmDeleteUser(user: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.email}" ?`)) {
      this.deleteUser(user._id);
    }
  }

  openCreateUserDialog() {
    // TODO: Implémenter un dialog de création
    this.showInfoMessage('Dialog de création en développement');
  }

  // CRUD methods - Articles
  createArticle() {
    if (!this.newArticle.title) return;
    this.articlesService.createArticle(this.newArticle).subscribe(() => {
      this.loadArticles();
      this.newArticle = {};
      this.showSuccessMessage('Article ajouté avec succès');
    });
  }

  deleteArticle(id: string) {
    this.articlesService.deleteArticle(id).subscribe(() => {
      this.loadArticles();
      this.showSuccessMessage('Article supprimé avec succès');
    });
  }

  editArticle(article: any) {
    // TODO: Implémenter un dialog d'édition
    this.showInfoMessage('Fonction d\'édition en développement');
  }

  confirmDeleteArticle(article: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${article.title}" ?`)) {
      this.deleteArticle(article._id);
    }
  }

  openCreateArticleDialog() {
    // TODO: Implémenter un dialog de création
    this.showInfoMessage('Dialog de création en développement');
  }

  // Utility methods
  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getArticleExcerpt(content: string): string {
    if (!content) return 'Aucun contenu...';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }

  // Notification methods
  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showInfoMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
