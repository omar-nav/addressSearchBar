import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Address } from './address';

@Injectable({
  providedIn: 'root',
})
export class AddressSuggestionsService {
  endpoint: string =
    'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=';

  constructor(private httpClient: HttpClient) {}

  searchAddress(term: string): Observable<Address[]> {
    let url = `${this.endpoint}${term}&maxLocations=5&location=30.270,-97.745&distance=80467.2`;

    if (!term.trim()) {
      return of([]);
    }
    return this.httpClient
      .get<Address[]>(url)
      .pipe(
        map((data) => data['candidates']),
          catchError(this.handleError<Address[]>('addresses', []))
        );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`failed: ${error.message}`);
      return of(result as T);
    };
  }
}
