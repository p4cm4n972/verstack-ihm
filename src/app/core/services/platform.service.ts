import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private readonly _isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  get isBrowser(): boolean {
    return this._isBrowser;
  }

  getLocalStorageItem(key: string): string | null {
    return this._isBrowser ? localStorage.getItem(key) : null;
  }

  setLocalStorageItem(key: string, value: string): void {
    if (this._isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  removeLocalStorageItem(key: string): void {
    if (this._isBrowser) {
      localStorage.removeItem(key);
    }
  }

  getSessionStorageItem(key: string): string | null {
    return this._isBrowser ? sessionStorage.getItem(key) : null;
  }

  setSessionStorageItem(key: string, value: string): void {
    if (this._isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }

  getJson<T>(key: string, defaultValue: T): T {
    const item = this.getLocalStorageItem(key);
    if (!item) {
      return defaultValue;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  setJson<T>(key: string, value: T): void {
    this.setLocalStorageItem(key, JSON.stringify(value));
  }

  getCurrentUrl(): string {
    return this._isBrowser ? window.location.href : '';
  }

  getCurrentOrigin(): string {
    return this._isBrowser ? window.location.origin : '';
  }
}