import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  /**
   * @method - to redirect to login on error
   * @param error
   */
  handleError(error: any) {
    if (error.status === 401) {  
      this.router.navigate(['']);
      window.location.reload();
    }
  }
}
