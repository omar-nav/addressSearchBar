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
    let url = `${this.endpoint}${term}&outfields=Match_addr,Addr_type=PointAddress`;
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
