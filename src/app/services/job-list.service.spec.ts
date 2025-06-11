import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { JobListService } from './job-list.service';

describe('JobListService', () => {
  let service: JobListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(JobListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
