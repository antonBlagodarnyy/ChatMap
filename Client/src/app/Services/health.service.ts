import { Injectable } from '@angular/core';
import { LoadingComponent } from '../Components/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  spinnerTimeout!: NodeJS.Timeout;
  spinnerRef: any;

  constructor(private dialogRef: MatDialog, private http: HttpClient) {}

   openLoader() {
    this.spinnerTimeout = setTimeout(() => {
      this.spinnerRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);
  }
   closeLoarder() {
    if (this.spinnerRef) this.spinnerRef.close();
    clearTimeout(this.spinnerTimeout);
  }
  check$(){
    return this.http.get(environment.apiUrl + 'health/check')
  }
}
