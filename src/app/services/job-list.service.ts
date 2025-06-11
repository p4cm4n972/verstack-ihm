import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SignupData {
  jobList: string[];
  experienceList: string[];
  ageRanges: string[];
  salaryRanges: string[];
}

@Injectable({
  providedIn: 'root'
})
export class JobListService {
  private jsonUrl = 'json/jobList.json';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<SignupData> {
    return this.http.get<SignupData>(this.jsonUrl);
  }

  getJobList(): Observable<string[]> {
    return this.getAllData().pipe(map((data) => data.jobList));
  }

  getExperienceList(): Observable<string[]> {
    return this.getAllData().pipe(map((data) => data.experienceList));
  }

  getAgeRanges(): Observable<string[]> {
    return this.getAllData().pipe(map((data) => data.ageRanges));
  }

  getSalaryRanges(): Observable<string[]> {
    return this.getAllData().pipe(map((data) => data.salaryRanges));
  }
}
