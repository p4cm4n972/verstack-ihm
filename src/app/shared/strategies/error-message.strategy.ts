import { HttpErrorResponse } from "@angular/common/http";
export interface ErrorMessageStrategy {
  getMessage(error: HttpErrorResponse): string;
}

export class BadRequestStrategy implements ErrorMessageStrategy {
  getMessage(): string {
    return 'Requête invalide. Vérifiez les données envoyées.';
  }
}

export class UnauthorizedStrategy implements ErrorMessageStrategy {
  getMessage(): string {
    return 'Non autorisé. Veuillez vous connecter.';
  }
}

export class ForbiddenStrategy implements ErrorMessageStrategy {
  getMessage(): string {
    return 'Accès refusé.';
  }
}

export class NotFoundStrategy implements ErrorMessageStrategy {
  getMessage(): string {
    return 'Utilisateur introuvable.';
  }
}

export class ServerErrorStrategy implements ErrorMessageStrategy {
  getMessage(): string {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }
}

export class DefaultErrorStrategy implements ErrorMessageStrategy {
  getMessage(error: HttpErrorResponse): string {
    return `Erreur ${error.status}: ${error.message}`;
  }
}

export const strategyMap = new Map<number, ErrorMessageStrategy>([
  [400, new BadRequestStrategy()],
  [401, new UnauthorizedStrategy()],
  [403, new ForbiddenStrategy()],
  [404, new NotFoundStrategy()],
  [500, new ServerErrorStrategy()],
]);
