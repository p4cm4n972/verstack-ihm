import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', () => {
    service.getAllUsers().subscribe();
    const req = httpMock.expectOne('api/users');
    expect(req.request.method).toBe('GET');
  });

  it('should post user', () => {
    service.createUser({ name: 'John' }).subscribe();
    const req = httpMock.expectOne('api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
  });

  it('should delete user', () => {
    service.deleteUser('1').subscribe();
    const req = httpMock.expectOne('api/users/1');
    expect(req.request.method).toBe('DELETE');
  });

  it('should patch user favoris', () => {
    service.update('2', ['a']).subscribe();
    const req = httpMock.expectOne('api/users/2');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ favoris: ['a'] });
  });
});
