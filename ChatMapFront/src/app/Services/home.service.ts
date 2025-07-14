import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  printUsers() {
    this.http.get(this.apiUrl + 'users/all').subscribe((data) => {
      console.log(data);
    });
  }
}
