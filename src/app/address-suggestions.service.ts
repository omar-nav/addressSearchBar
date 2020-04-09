import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IAddress } from './address';

@Injectable({
  providedIn: 'root',
})
export class AddressSuggestionsService {
  // private addressSuggestionsUrl = 'api/addressSuggestions/suggestions.json';
  private addressSuggestionsUrl =
    'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=';
  public candidates: any;

  constructor(private httpClient: HttpClient) {}

  getAddressSuggestions(term: string): Observable<any> {
    return this.httpClient.get(
      'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=' +
        term +
        '&outfields=Match_addr,Addr_type=PointAddress'
    );
  }
  // this.http
  //   .get<IAddress[]>(
  //     `${this.addressSuggestionsUrl}${searchString}&outfields=Match_addr,Addr_type=PointAddress`
  //   )
  //   .pipe(
  //     map(
  //       (response) =>
  //         (this.candidates = response['candidates'])
  //     )
  //   )
  //   .pipe(
  //     tap((data) =>
  //       console.log('Address suggestions: ' + JSON.stringify(data))
  //     ),
  //     catchError(this.handleError)
  //   );
  // return this.candidates;

  getAddressSuggestion(id: number): Observable<IAddress | undefined> {
    return this.getAddressSuggestions(this.addressSuggestionsUrl).pipe(
      map((addresses: IAddress[]) => addresses.find((a) => a.addressId === id))
    );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
